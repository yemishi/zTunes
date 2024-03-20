import Link from "next/link";
import { IconType } from "react-icons/lib";
import { MdKeyboardArrowRight } from "react-icons/md";

type CardProps = {
  Icon: IconType;
  title: string;
  href?: string;
  arrowClass?: string;
  onClick?: () => void;
  noArrow?: boolean;
  subTitle?: string;
  subTitleSimple?: boolean;
};
export function CardAcc({
  subTitleSimple,
  noArrow,
  subTitle,
  title,
  Icon,
  arrowClass,
  href,
  onClick,
}: CardProps) {
  const Component = href ? Link : "button";
  return (
    <Component
      onClick={onClick}
      href={href as string}
      className="font-poppins text-lg p-3 flex gap-2 items-center w-full"
    >
      <Icon className="size-9" />
      <span className="flex flex-col items-start">
        <span>{title}</span>
        {subTitle && (
          <span
            className={`text-xs  ${
              subTitleSimple ? "text-gray-300" : "text-orange-300"
            }`}
          >
            {subTitle}
          </span>
        )}
      </span>
      {!noArrow && (
        <MdKeyboardArrowRight className={`size-9 duration-150 ml-auto ${arrowClass}`} />
      )}
    </Component>
  );
}
