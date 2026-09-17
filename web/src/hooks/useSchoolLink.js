import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export default function useSchoolLink() {
  const [searchParams] = useSearchParams();
  const requestedSchoolId = searchParams.get("school_id")?.trim() || "";
  const schoolId = /^\d+$/.test(requestedSchoolId) ? requestedSchoolId : "";

  const withSchoolId = useCallback(
    (path) => {
      if (!schoolId) return path;

      const [pathAndQuery, hash = ""] = path.split("#", 2);
      const separator = pathAndQuery.includes("?") ? "&" : "?";
      const target = `${pathAndQuery}${separator}school_id=${encodeURIComponent(schoolId)}`;

      return hash ? `${target}#${hash}` : target;
    },
    [schoolId],
  );

  return { schoolId, withSchoolId };
}
