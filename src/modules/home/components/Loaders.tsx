import { Skeleton } from "antd";

export const ContentLoader = ({ loading }) => (
  <>
    <Skeleton loading={loading} active />
    <Skeleton loading={loading} active />
    <Skeleton loading={loading} active />
    <Skeleton loading={loading} active />
  </>
);

export const SiderLoader = ({ loading, component }) => (
  <>
    <Skeleton round avatar active className="my-5" loading={loading}>
      {component}
    </Skeleton>
    <Skeleton round avatar active className="my-5" loading={loading} />
    <Skeleton round avatar active className="my-5" loading={loading} />
  </>
);

