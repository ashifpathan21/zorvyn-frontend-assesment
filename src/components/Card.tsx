// Utility function for combining classNames
export const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

const Card = ({
  children,
  className = "",
  hoverable = false,
  ...props
}: {
  children: any;
  className: any;
  hoverable: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-neutral-50 rounded-xl shadow-sm",
        hoverable ? "hover:shadow-md transition-shadow duration-200" : "",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
