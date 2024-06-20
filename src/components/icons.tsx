import { cn } from "@/lib/utils";
import {
  AlignJustify,
  ArrowDown,
  BellIcon,
  Boxes,
  CarFront,
  Github,
  Home,
  Info,
  LayoutDashboard,
  Loader2,
  LogOut,
  type LucideProps,
  Minus,
  Moon,
  ParkingSquareOff,
  Plus,
  Printer,
  Search,
  Settings,
  Sun,
  Truck,
  UserIcon,
  Warehouse,
  X,
} from "lucide-react";
import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

const fillDefault = "#8D8D8D";

const TriangleLeft = (props: LucideProps) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-[#8D8D8D]", props.className)}
    >
      <title />
      <path d="M16 6a1 1 0 0 0-1.6-.8l-8 6a1 1 0 0 0 0 1.6l8 6A1 1 0 0 0 16 18V6Z" />
    </svg>
  );
};

const TruckUnload = (props: LucideProps) => {
  return (
    <svg
      width="1.25em"
      height="1em"
      viewBox="0 0 640 512"
      xmlns="http://www.w3.org/2000/svg"
      stroke={props.color || fillDefault}
      strokeWidth={40}
      className={cn("fill-[#fff]", props.className)}
    >
      <path d="M50.2 375.6c2.3 8.5 11.1 13.6 19.6 11.3l216.4-58c8.5-2.3 13.6-11.1 11.3-19.6l-49.7-185.5c-2.3-8.5-11.1-13.6-19.6-11.3L151 133.3l24.8 92.7l-61.8 16.5l-24.8-92.7l-77.3 20.7C3.4 172.8-1.7 181.6.6 190.1l49.6 185.5zM384 0c-17.7 0-32 14.3-32 32v323.6L5.9 450c-4.3 1.2-6.8 5.6-5.6 9.8l12.6 46.3c1.2 4.3 5.6 6.8 9.8 5.6l393.7-107.4C418.8 464.1 467.6 512 528 512c61.9 0 112-50.1 112-112V0H384zm144 448c-26.5 0-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48z" />
    </svg>
  );
};

const MaterialFilter = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 12.475 8.316"
      {...props}
    >
      <path
        id="Icon_material-filter-list"
        data-name="Icon material-filter-list"
        d="M9.351,17.316h2.772V15.93H9.351ZM4.5,9v1.386H16.975V9Zm2.079,4.851H14.9V12.465H6.579Z"
        transform="translate(-4.5 -9)"
        fill="#039"
      />
    </svg>
  );
};

const View = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 17.556 11.037"
      {...props}
    >
      <path
        id="Icon_awesome-eye"
        data-name="Icon awesome-eye"
        d="M17.45,9.6A9.847,9.847,0,0,0,8.778,4.5,9.848,9.848,0,0,0,.106,9.6a.883.883,0,0,0,0,.839,9.847,9.847,0,0,0,8.672,5.1,9.848,9.848,0,0,0,8.672-5.1A.883.883,0,0,0,17.45,9.6ZM8.778,14.157a4.269,4.269,0,0,1-4.389-4.139A4.269,4.269,0,0,1,8.778,5.88a4.269,4.269,0,0,1,4.389,4.139A4.267,4.267,0,0,1,8.778,14.157Zm0-6.9a3.068,3.068,0,0,0-.771.109,1.318,1.318,0,0,1-.143,1.788,1.525,1.525,0,0,1-1.9.135A2.678,2.678,0,0,0,7.158,12.3a3.063,3.063,0,0,0,3.4-.1,2.662,2.662,0,0,0,.987-3.072,2.912,2.912,0,0,0-2.77-1.866Z"
        transform="translate(0 -4.5)"
        fill="#039"
      />
    </svg>
  );
};

const Edit = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 17.13 15.001"
      {...props}
      className={cn("fill-primary", props.className)}
    >
      <path
        id="Icon_awesome-edit"
        data-name="Icon awesome-edit"
        d="M11.973,2.442l2.682,2.643a.284.284,0,0,1,0,.4L8.16,11.89l-2.76.3a.574.574,0,0,1-.639-.63l.306-2.719,6.495-6.4A.294.294,0,0,1,11.973,2.442Zm4.818-.671L15.339.341a1.175,1.175,0,0,0-1.642,0L12.645,1.378a.284.284,0,0,0,0,.4l2.682,2.643a.294.294,0,0,0,.41,0l1.053-1.037a1.134,1.134,0,0,0,0-1.618ZM11.42,10.149v2.983H1.9V3.755H8.737a.368.368,0,0,0,.253-.1L10.18,2.48a.351.351,0,0,0-.253-.6h-8.5A1.418,1.418,0,0,0,0,3.286V13.6a1.418,1.418,0,0,0,1.427,1.407H11.9A1.418,1.418,0,0,0,13.323,13.6V8.977a.358.358,0,0,0-.61-.249L11.524,9.9A.358.358,0,0,0,11.42,10.149Z"
        transform="translate(0 -0.007)"
        fill="current"
      />
    </svg>
  );
};

const Google = (props: React.ComponentPropsWithoutRef<"svg">) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Google</title>
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
    />
    <path
      fill="#FF3D00"
      d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
    />
  </svg>
);

export const Icons = {
  add: Plus,
  subtract: Minus,
  logo: ParkingSquareOff,
  close: X,
  moon: Moon,
  sun: Sun,
  spinner: Loader2,
  gitHub: Github,
  hamburger: AlignJustify,
  triangleLeft: TriangleLeft,
  bell: BellIcon,
  home: Home,
  user: UserIcon,
  settings: Settings,
  logout: LogOut,
  search: Search,
  arrow: ArrowDown,
  dashboard: LayoutDashboard,
  view: View,
  edit: Edit,
  filter: MaterialFilter,
  info: Info,
  google: Google,
  print: Printer,
};

interface SideNavIconProps {
  isFilled: boolean;
}

const Calculator = ({ isFilled = false }: SideNavIconProps) => {
  const Icon = !isFilled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 18.214 20.602"
    >
      <path
        id="Icon_awesome-calculator"
        data-name="Icon awesome-calculator"
        d="M14.923,0H1.791A1.836,1.836,0,0,0,0,1.791v15.52A1.836,1.836,0,0,0,1.791,19.1H14.923a1.836,1.836,0,0,0,1.791-1.791V1.791A1.836,1.836,0,0,0,14.923,0ZM4.775,16.236a.514.514,0,0,1-.478.478H2.865a.514.514,0,0,1-.478-.478V14.8a.514.514,0,0,1,.478-.478H4.3a.514.514,0,0,1,.478.478Zm0-4.775a.514.514,0,0,1-.478.478H2.865a.514.514,0,0,1-.478-.478V10.028a.514.514,0,0,1,.478-.478H4.3a.514.514,0,0,1,.478.478Zm4.775,4.775a.514.514,0,0,1-.478.478H7.641a.514.514,0,0,1-.478-.478V14.8a.514.514,0,0,1,.478-.478H9.073a.514.514,0,0,1,.478.478Zm0-4.775a.514.514,0,0,1-.478.478H7.641a.514.514,0,0,1-.478-.478V10.028a.514.514,0,0,1,.478-.478H9.073a.514.514,0,0,1,.478.478Zm4.775,4.775a.514.514,0,0,1-.478.478H12.416a.514.514,0,0,1-.478-.478V10.028a.514.514,0,0,1,.478-.478h1.433a.514.514,0,0,1,.478.478v6.208Zm0-9.551a.514.514,0,0,1-.478.478H2.865a.514.514,0,0,1-.478-.478V2.865a.514.514,0,0,1,.478-.478H13.849a.514.514,0,0,1,.478.478Z"
        transform="translate(0.75 0.75)"
        fill="none"
        stroke="#8d8d8d"
        strokeWidth="1.5"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 18.214 20.602"
    >
      <path
        id="Icon_awesome-calculator"
        data-name="Icon awesome-calculator"
        d="M14.923,0H1.791A1.836,1.836,0,0,0,0,1.791v15.52A1.836,1.836,0,0,0,1.791,19.1H14.923a1.836,1.836,0,0,0,1.791-1.791V1.791A1.836,1.836,0,0,0,14.923,0ZM4.775,16.236a.514.514,0,0,1-.478.478H2.865a.514.514,0,0,1-.478-.478V14.8a.514.514,0,0,1,.478-.478H4.3a.514.514,0,0,1,.478.478Zm0-4.775a.514.514,0,0,1-.478.478H2.865a.514.514,0,0,1-.478-.478V10.028a.514.514,0,0,1,.478-.478H4.3a.514.514,0,0,1,.478.478Zm4.775,4.775a.514.514,0,0,1-.478.478H7.641a.514.514,0,0,1-.478-.478V14.8a.514.514,0,0,1,.478-.478H9.073a.514.514,0,0,1,.478.478Zm0-4.775a.514.514,0,0,1-.478.478H7.641a.514.514,0,0,1-.478-.478V10.028a.514.514,0,0,1,.478-.478H9.073a.514.514,0,0,1,.478.478Zm4.775,4.775a.514.514,0,0,1-.478.478H12.416a.514.514,0,0,1-.478-.478V10.028a.514.514,0,0,1,.478-.478h1.433a.514.514,0,0,1,.478.478v6.208Zm0-9.551a.514.514,0,0,1-.478.478H2.865a.514.514,0,0,1-.478-.478V2.865a.514.514,0,0,1,.478-.478H13.849a.514.514,0,0,1,.478.478Z"
        transform="translate(0.75 0.75)"
        fill="#039"
      />
    </svg>
  );
  return Icon;
};

export const Bullet = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={cn(
        "mr-2 inline-flex h-1.5 w-1.5 rounded-full bg-primary",
        className,
      )}
      {...props}
    />
  );
};

const ShoppingCart = ({ isFilled = false }: SideNavIconProps) => {
  return !isFilled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 26.603 23.865"
    >
      <path
        id="Icon_awesome-shopping-cart"
        data-name="Icon awesome-shopping-cart"
        d="M22.553,12.868l2.019-8.882a1.025,1.025,0,0,0-1-1.252H6.8L6.407.819A1.025,1.025,0,0,0,5.4,0H1.025A1.025,1.025,0,0,0,0,1.025v.683A1.025,1.025,0,0,0,1.025,2.733H4.009l3,14.666a2.392,2.392,0,1,0,2.863.366h8.953a2.391,2.391,0,1,0,2.716-.444l.236-1.037a1.025,1.025,0,0,0-1-1.252H9.315l-.279-1.367H21.554A1.025,1.025,0,0,0,22.553,12.868Z"
        transform="translate(1 1)"
        fill="none"
        stroke="#8d8d8d"
        strokeWidth="2"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24.598 21.865"
    >
      <path
        id="Icon_awesome-shopping-cart"
        data-name="Icon awesome-shopping-cart"
        d="M22.553,12.868l2.019-8.882a1.025,1.025,0,0,0-1-1.252H6.8L6.407.819A1.025,1.025,0,0,0,5.4,0H1.025A1.025,1.025,0,0,0,0,1.025v.683A1.025,1.025,0,0,0,1.025,2.733H4.009l3,14.666a2.392,2.392,0,1,0,2.863.366h8.953a2.391,2.391,0,1,0,2.716-.444l.236-1.037a1.025,1.025,0,0,0-1-1.252H9.315l-.279-1.367H21.554A1.025,1.025,0,0,0,22.553,12.868Z"
        fill="#039"
      />
    </svg>
  );
};

function SideDashboard({ isFilled = false }: SideNavIconProps) {
  return !isFilled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 23.078 23.078"
    >
      <path
        id="Icon_material-dashboard"
        data-name="Icon material-dashboard"
        d="M4.5,16.21h9.368V4.5H4.5Zm0,9.368h9.368V18.552H4.5Zm11.71,0h9.368V13.868H16.21Zm0-21.078v7.026h9.368V4.5Z"
        transform="translate(-3.5 -3.5)"
        fill="none"
        stroke="#8d8d8d"
        strokeWidth="2"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 23.078 23.078"
    >
      <path
        id="Icon_material-dashboard"
        data-name="Icon material-dashboard"
        d="M4.5,16.21h9.368V4.5H4.5Zm0,9.368h9.368V18.552H4.5Zm11.71,0h9.368V13.868H16.21Zm0-21.078v7.026h9.368V4.5Z"
        transform="translate(-3.5 -3.5)"
        fill="#039"
      />
    </svg>
  );
}

const Peso = ({ isFilled = false }: SideNavIconProps) => {
  const icon = (
    <Image
      src={isFilled ? "/images/Card2.png" : "/images/Card.png"}
      width={25}
      height={30}
      alt="card-credit"
    />
  );
  return icon;
};

export const BackIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask id="ipSBack0">
        <path
          fill="#fff"
          fillRule="evenodd"
          stroke="#fff"
          strokeLinejoin="round"
          strokeWidth="4"
          d="M44 40.836c-4.893-5.973-9.238-9.362-13.036-10.168c-3.797-.805-7.412-.927-10.846-.365V41L4 23.545L20.118 7v10.167c6.349.05 11.746 2.328 16.192 6.833c4.445 4.505 7.009 10.117 7.69 16.836Z"
          clipRule="evenodd"
        />
      </mask>
      <path fill="#ffffff" d="M0 0h48v48H0z" mask="url(#ipSBack0)" />
    </svg>
  );
};

export const FaChecked = (props: { active: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12.836"
      height="12.836"
      viewBox="0 0 12.836 12.836"
    >
      <path
        id="Icon_awesome-check-circle"
        data-name="Icon awesome-check-circle"
        d="M13.4,6.98A6.418,6.418,0,1,1,6.98.563,6.418,6.418,0,0,1,13.4,6.98Zm-7.16,3.4L11,5.617a.414.414,0,0,0,0-.586l-.586-.586a.414.414,0,0,0-.586,0L5.945,8.329,4.132,6.516a.414.414,0,0,0-.586,0L2.961,7.1a.414.414,0,0,0,0,.586l2.691,2.691a.414.414,0,0,0,.586,0Z"
        transform="translate(-0.563 -0.563)"
        fill={props.active ? "#039" : "#c9c9c9"}
      />
    </svg>
  );
};

export const SideNavIcons = {
  peso: Peso,
  cart: ShoppingCart,
  calculator: Calculator,
  dashboard: SideDashboard,
  truck: Truck,
  boxes: Boxes,
  warehouse: Warehouse,
  car: CarFront,
  truckLoad: TruckUnload,
} as const;
