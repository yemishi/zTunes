import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";

type CardProps = {
  title: string;
  href?: string;
  arrowClass?: string;
  onClick?: () => void;
  noArrow?: boolean;
  subTitle?: string;
  subTitleSimple?: boolean;
  artistIcon?: boolean;
};
export default function CardAcc({ subTitleSimple, noArrow, subTitle, title, arrowClass, href, onClick }: CardProps) {
  const Component = href ? Link : "button";

  const content = (
    <>
      <span className="flex flex-col items-start">
        <span>{title}</span>
        {subTitle && (
          <span className={`text-xs md:text-sm ${subTitleSimple ? "text-gray-300" : "text-orange-300"}`}>
            {subTitle}
          </span>
        )}
      </span>
      {!noArrow && <MdKeyboardArrowRight className={`size-9 duration-150 ml-auto ${arrowClass}`} />}
    </>
  );
  return (
    <Component
      onClick={onClick}
      href={href as string}
      className="font-poppins text-lg md:text-xl p-3 flex gap-2 items-center w-full"
    >
      {content}
    </Component>
  );
}
