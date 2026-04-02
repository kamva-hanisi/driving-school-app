export default function Button({
  children,
  className = "",
  fullWidth = false,
  type = "button",
  variant = "primary",
  ...props
}) {
  const classes = ["button", `button--${variant}`, fullWidth ? "button--full" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
