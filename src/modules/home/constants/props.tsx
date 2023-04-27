import { DrawerProps, Typography } from "antd";
import { DrawerPanelProps } from "antd/es/drawer/DrawerPanel";

interface IDrawerSharedProps {
  title: string;
}

export const drawerSharedProps: (
  props: IDrawerSharedProps
) => Partial<DrawerProps> = ({ title }: IDrawerSharedProps) => ({
  width: "50em",
  title: <Typography.Title className="m-0">{title}</Typography.Title>,
});

