import { List, Space, Typography } from "antd";
import { IContact } from "../api/types";
import { capitalize } from "../../../utils/strings";

interface IProps {
  contactList: IContact[];
}

const SideBarBody = ({ contactList }) => {
  return (
    <List
      className="border p-3"
      dataSource={contactList}
      renderItem={(item: IContact) => {
        const { firstName, lastName, email } = item.contact;
        return (
          <List.Item>
            <Space direction="vertical">
              <Space>
                <strong>{capitalize(firstName)}</strong>
                <strong>{capitalize(lastName)}</strong>
                {`(${email})`}
              </Space>

              <Typography.Paragraph ellipsis={{ rows: 3 }}>
                In cupidatat esse irure aliquip laboris sint nostrud
                reprehenderit reprehenderit excepteur. Aute ut laborum nostrud
                duis Lorem Lorem excepteur excepteur ipsum in. Adipisicing esse
                reprehenderit officia sint tempor sunt exercitation eu
                exercitation voluptate do voluptate. Incididunt consequat ut
                veniam sunt fugiat velit minim consectetur veniam fugiat id.
              </Typography.Paragraph>
            </Space>
          </List.Item>
        );
      }}
    />
  );
};

export default SideBarBody;

