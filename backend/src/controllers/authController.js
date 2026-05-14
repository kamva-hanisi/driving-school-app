import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ALLOWED_ROLES = new Set(["owner", "admin"]);
const SUPPORTED_SOCIAL_PROVIDERS = new Set(["google", "facebook"]);

const query = (sql, values = []) =>
  db.query(sql, values).then((result) => result.rows);

const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

const getFrontendUrl = () =>
  (process.env.FRONTEND_URL || "http://localhost:5173").trim();

const getGoogleCallbackUrl = (req) =>
  (
    process.env.GOOGLE_CALLBACK_URL ||
    `${getBaseUrl(req)}/api/auth/google/callback`
  ).trim();

const getFacebookCallbackUrl = (req) =>
  (
    process.env.FACEBOOK_CALLBACK_URL ||
    `${getBaseUrl(req)}/api/auth/facebook/callback`
  ).trim();

const createToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      school_id: user.school_id,
    },
    process.env.JWT_SECRET,
  );

const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  school_id: user.school_id,
  provider: user.provider,
  avatar_url: user.avatar_url,
  account_status: user.account_status,
  deactivated_until: user.deactivated_until,
});

const redirectWithAuthResult = (res, payload) => {
  const redirectUrl = new URL("/auth/callback", getFrontendUrl());

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      redirectUrl.searchParams.set(key, String(value));
    }
  });

  res.redirect(redirectUrl.toString());
};

const redirectWithError = (res, message) => {
  redirectWithAuthResult(res, { error: message });
};

const findUserByEmail = async (email) => {
  const users = await query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
  return users[0] || null;
};

const insertSocialUser = async ({
  name,
  email,
  provider,
  providerId,
  avatarUrl,
  role = "owner",
}) => {
  const result = await query(
    `INSERT INTO users
     (name, email, password, role, school_id, provider, provider_id, avatar_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [name, email, null, role, null, provider, providerId, avatarUrl],
  );

  return result[0];
};

const updateSocialUser = async (user, { provider, providerId, avatarUrl }) => {
  const users = await query(
    `UPDATE users
     SET provider = $1, provider_id = $2, avatar_url = $3
     WHERE id = $4
     RETURNING *`,
    [provider, providerId, avatarUrl, user.id],
  );

  return users[0];
};

const upsertSocialUser = async ({
  name,
  email,
  provider,
  providerId,
  avatarUrl,
}) => {
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    return insertSocialUser({
      name,
      email,
      provider,
      providerId,
      avatarUrl,
    });
  }

  return updateSocialUser(existingUser, {
    provider,
    providerId,
    avatarUrl,
  });
};

const exchangeGoogleCode = async ({ code, req }) => {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("Google login is not configured");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getGoogleCallbackUrl(req),
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error("Google token exchange failed");
  }

  const tokenData = await tokenResponse.json();

  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!profileResponse.ok) {
    throw new Error("Google profile lookup failed");
  }

  const profile = await profileResponse.json();

  return {
    provider: "google",
    providerId: profile.id,
    name: profile.name,
    email: profile.email?.toLowerCase(),
    avatarUrl: profile.picture || null,
  };
};

const exchangeFacebookCode = async ({ code, req }) => {
  const appId = process.env.FACEBOOK_APP_ID?.trim();
  const appSecret = process.env.FACEBOOK_APP_SECRET?.trim();

  if (!appId || !appSecret) {
    throw new Error("Facebook login is not configured");
  }

  const tokenUrl = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
  tokenUrl.searchParams.set("client_id", appId);
  tokenUrl.searchParams.set("client_secret", appSecret);
  tokenUrl.searchParams.set("redirect_uri", getFacebookCallbackUrl(req));
  tokenUrl.searchParams.set("code", code);

  const tokenResponse = await fetch(tokenUrl);

  if (!tokenResponse.ok) {
    throw new Error("Facebook token exchange failed");
  }

  const tokenData = await tokenResponse.json();
  const profileUrl = new URL("https://graph.facebook.com/me");
  profileUrl.searchParams.set("fields", "id,name,email,picture");
  profileUrl.searchParams.set("access_token", tokenData.access_token);

  const profileResponse = await fetch(profileUrl);

  if (!profileResponse.ok) {
    throw new Error("Facebook profile lookup failed");
  }

  const profile = await profileResponse.json();

  return {
    provider: "facebook",
    providerId: profile.id,
    name: profile.name,
    email: profile.email?.toLowerCase(),
    avatarUrl: profile.picture?.data?.url || null,
  };
};

const getSocialAuthorizationUrl = (provider, req) => {
  if (!SUPPORTED_SOCIAL_PROVIDERS.has(provider)) {
    throw new Error("Unsupported social provider");
  }

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();

    if (!clientId) {
      throw new Error("Google login is not configured");
    }

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", getGoogleCallbackUrl(req));
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid email profile");
    url.searchParams.set("prompt", "select_account");
    return url.toString();
  }

  const appId = process.env.FACEBOOK_APP_ID?.trim();

  if (!appId) {
    throw new Error("Facebook login is not configured");
  }

  const url = new URL("https://www.facebook.com/v19.0/dialog/oauth");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", getFacebookCallbackUrl(req));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "email,public_profile");
  return url.toString();
};

export const register = async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();
  const schoolId = req.body.school_id ?? null;
  const role = req.body.role?.trim().toLowerCase() || "owner";

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  if (!ALLOWED_ROLES.has(role)) {
    return res.status(400).json({ message: "Invalid account role" });
  }

  try {
    const hashed = bcrypt.hashSync(password, 10);

    await query(
      `INSERT INTO users
       (name, email, password, role, school_id, provider, provider_id, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [name, email, hashed, role, schoolId, "local", null, null],
    );

    return res.json({ message: "User registered" });
  } catch (error) {
    if (error?.code === "23505") {
      return res.status(409).json({ message: "Email already registered" });
    }

    return res.status(500).json({ message: "Failed to register user" });
  }
};

export const login = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.account_status === "deactivated" &&
      user.deactivated_until &&
      new Date(user.deactivated_until) > new Date()
    ) {
      return res.status(403).json({
        message:
          "This account is temporarily deactivated. Please try again after 30 days or contact support.",
      });
    }

    if (user.account_status === "deleted") {
      return res.status(403).json({ message: "This account has been deleted" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: `This account uses ${user.provider || "social"} login. Continue with that provider.`,
      });
    }

    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to log in" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const users = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [
      req.user.id,
    ]);

    if (!users[0]) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.json({ user: formatUser(users[0]) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load account settings" });
  }
};

export const deleteCurrentUser = async (req, res) => {
  const mode = req.body.mode?.trim().toLowerCase();

  if (!["temporary", "permanent"].includes(mode)) {
    return res.status(400).json({
      message: "Choose temporary deactivation or permanent deletion",
    });
  }

  try {
    if (mode === "permanent") {
      const deletedUsers = await query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [req.user.id],
      );

      if (deletedUsers.length === 0) {
        return res.status(404).json({ message: "Account not found" });
      }

      return res.json({ message: "Account permanently deleted" });
    }

    const [user] = await query(
      `UPDATE users
       SET account_status = 'deactivated',
           deletion_scheduled_at = CURRENT_TIMESTAMP,
           deactivated_until = CURRENT_TIMESTAMP + INTERVAL '30 days'
       WHERE id = $1
       RETURNING *`,
      [req.user.id],
    );

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.json({
      message: "Account temporarily deactivated for 30 days",
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update account" });
  }
};

export const startSocialAuth = (provider) => (req, res) => {
  try {
    const url = getSocialAuthorizationUrl(provider, req);
    res.redirect(url);
  } catch (error) {
    redirectWithError(res, error.message);
  }
};

export const handleSocialCallback = (provider) => async (req, res) => {
  const { code, error, error_description: errorDescription } = req.query;

  if (error) {
    redirectWithError(res, errorDescription || `${provider} login was cancelled`);
    return;
  }

  if (!code) {
    redirectWithError(res, `Missing ${provider} authorization code`);
    return;
  }

  try {
    const profile =
      provider === "google"
        ? await exchangeGoogleCode({ code, req })
        : await exchangeFacebookCode({ code, req });

    if (!profile.email || !profile.name || !profile.providerId) {
      redirectWithError(
        res,
        `${provider} did not return enough account information`,
      );
      return;
    }

    const user = await upsertSocialUser(profile);
    const token = createToken(user);

    redirectWithAuthResult(res, {
      token,
      user: encodeURIComponent(JSON.stringify(formatUser(user))),
    });
  } catch (callbackError) {
    redirectWithError(res, callbackError.message || `${provider} login failed`);
  }
};
