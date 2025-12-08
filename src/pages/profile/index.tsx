import React from 'react';
import { Page, Header, List, Icon, Avatar, Box, Text } from 'zmp-ui';

const ProfilePage: React.FC = () => {
  return (
    <Page className="bg-gray-100 h-full">
      <Header title="Tài khoản" showBackIcon={false} className="bg-white" />

      {/* Phần thông tin người dùng */}
      <div className="bg-white p-4 mb-2 flex items-center">
        <Avatar size={72} story="default" online src="https://i.imgur.com/8Km9tLL.png">
          U
        </Avatar>
        <Box className="ml-4">
          <Text.Title className="font-bold text-lg">Người dùng Zalo</Text.Title>
          <Text size="small" className="text-gray-500">
            Thành viên Bạc
          </Text>
        </Box>
      </div>

      {/* Menu chức năng */}
      <div className="bg-white mb-2">
        <Text.Header className="px-4 py-3 text-gray-500">Tiện ích</Text.Header>
        <List>
          <List.Item
            title="Lịch sử Voucher"
            prefix={<Icon icon="zi-clock-1" className="text-blue-500" />}
            suffix={<Icon icon="zi-chevron-right" />}
            onClick={() => console.log('Click history')}
          />
          <List.Item
            title="Quán ăn yêu thích"
            prefix={<Icon icon="zi-heart" className="text-red-500" />}
            suffix={<Icon icon="zi-chevron-right" />}
          />
          <List.Item
            title="Địa chỉ đã lưu"
            prefix={<Icon icon="zi-location" className="text-green-500" />}
            suffix={<Icon icon="zi-chevron-right" />}
          />
        </List>
      </div>

      <div className="bg-white">
        <Text.Header className="px-4 py-3 text-gray-500">Hệ thống</Text.Header>
        <List>
          <List.Item
            title="Cài đặt"
            prefix={<Icon icon="zi-setting" className="text-gray-500" />}
            suffix={<Icon icon="zi-chevron-right" />}
          />
          <List.Item
            title="Hỗ trợ & Liên hệ"
            prefix={<Icon icon="zi-call" className="text-gray-500" />}
            suffix={<Icon icon="zi-chevron-right" />}
          />
        </List>
      </div>
    </Page>
  );
};

export default ProfilePage;
