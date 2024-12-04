import React, { useRef, useState, useEffect } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  theme,
  Typography,
  Splitter,
  Flex,
  Select,
  Button,
  message,
  Modal,
 Upload as AntdUpload,
} from "antd";
import { Player } from "video-react";
import "video-react/dist/video-react.css";

const { Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = AntdUpload;


// 示例语音转文字文档数据
const transcript = [
  [
    { timestamp: 0.68, text: "这是" },
    { timestamp: 1.22, text: "2023" },
    { timestamp: 2.7, text: "年" },
    { timestamp: 3.26, text: "普通" },
    { timestamp: 4.22, text: "高等学校" },
    { timestamp: 5.16, text: "招生" },
    { timestamp: 5.64, text: "全国" },
    { timestamp: 6.9, text: "统一" },
    { timestamp: 7.6, text: "考试" },
    { timestamp: 8.2, text: "英语" },
    { timestamp: 9.24, text: "科" },
    { timestamp: 9.48, text: "听力" },
    { timestamp: 10.34, text: "部分" },
    { timestamp: 10.34, text: "。" },
    { timestamp: 11.58, text: "该" },
    { timestamp: 12.26, text: "部分" },
    { timestamp: 12.64, text: "分为" },
    { timestamp: 13.22, text: "第一" },
    { timestamp: 13.22, text: "、" },
    { timestamp: 14.22, text: "第二" },
    { timestamp: 14.88, text: "两节" },
    { timestamp: 15.48, text: "。" },
    { timestamp: 17.36, text: "注意" },
    { timestamp: 17.36, text: "," },
    { timestamp: 18.3, text: "回答" },
    { timestamp: 19.6, text: "听力" },
    { timestamp: 20.1, text: "部分" },
    { timestamp: 20.36, text: "时" },
    { timestamp: 20.36, text: "," },
    { timestamp: 20.96, text: "请" },
    { timestamp: 21.66, text: "先" },
    { timestamp: 22.0, text: "将" },
    { timestamp: 22.32, text: "答案" },
    { timestamp: 22.96, text: "标在" },
    { timestamp: 23.6, text: "试卷" },
    { timestamp: 24.1, text: "上" },
    { timestamp: 24.1, text: "。" },
  ],
  [
    { timestamp: 25.13, text: "听力" },
    { timestamp: 25.85, text: "部分" },
    { timestamp: 26.13, text: "结束" },
    { timestamp: 26.81, text: "前" },
    { timestamp: 26.81, text: "," },
    { timestamp: 27.37, text: "你" },
    { timestamp: 27.93, text: "将" },
    { timestamp: 28.17, text: "有" },
    { timestamp: 28.41, text: "两分钟" },
    { timestamp: 29.57, text: "的" },
    { timestamp: 29.69, text: "时间" },
    { timestamp: 30.13, text: "将" },
    { timestamp: 30.93, text: "你" },
    { timestamp: 30.93, text: "的" },
    { timestamp: 31.37, text: "答案" },
    { timestamp: 32.13, text: "转涂" },
    { timestamp: 32.99, text: "到" },
    { timestamp: 33.33, text: "答题卡" },
    { timestamp: 34.23, text: "上" },
  ],
];


function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("主页", "home", <HomeOutlined />),
  getItem("上传", "upload", <UploadOutlined />),
  getItem("观看", "watch", <PieChartOutlined />),
  // ... 省略其他代码，保持不变
];

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoSrc, setVideoSrc] = useState("1.mp4"); // 用于存储视频源
  const [jsonFiles, setJsonFiles] = useState([]); // 用于存储JSON文件路径历史记录
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const playerRef = useRef(null);

  
  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (player) {
      setCurrentTime(player.getState().player.currentTime);
    }
  };

  const handlePlaybackRateChange = (value) => {
    setPlaybackRate(value);
    const player = playerRef.current;
    if (player) {
      player.video.playbackRate = value;
    }
  };

  const handleTextClick = (timestamp) => {
    const player = playerRef.current;
    if (player) {
      player.seek(timestamp);
    }
  };

  const isHighlighted = (timestamp) => {
    return (
      currentTime >= timestamp &&
      (transcript.flat().find((item) => item.timestamp > timestamp)?.timestamp ??
        Infinity) > currentTime
    );
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const player = playerRef.current;
      if (!player) return;
      if (event.code === "Space") {
        event.preventDefault();
        const state = player.getState().player.paused;
        if (state) {
          player.play();
        } else {
          player.pause();
        }
      }
      if (event.code === "ArrowRight") {
        player.seek(player.getState().player.currentTime + 5);
      }
      if (event.code === "ArrowLeft") {
        player.seek(Math.max(player.getState().player.currentTime - 5, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleUploadVideo = (videoFile) => {
    const formData = new FormData();
    formData.append("video", videoFile);
    // 这里应该是上传视频到服务器的逻辑，返回时间戳 JSON 文件
    // 模拟上传过程
    message.loading("正在上传...");
    setTimeout(() => {
      message.success("上传成功！");
      // 假设服务器返回的 JSON 文件名为 video.json
      setVideoSrc("video.mp4"); // 更新视频源
      setJsonFiles([...jsonFiles, "video.json"]); // 添加JSON文件路径到历史记录
    }, 1000);
  };

  const handleUploadJson = (jsonFile) => {
    // 这里应该是上传JSON文件的逻辑
    setJsonFiles([...jsonFiles, jsonFile.name]); // 添加JSON文件路径到历史记录
  };

  const handleSelectVideoAndJson = () => {
    // 这里应该是选择本地视频和JSON文件的逻辑
    // 模拟选择过程
    setVideoSrc("selectedVideo.mp4"); // 更新视频源
    setJsonFiles([...jsonFiles, "selectedJson.json"]); // 添加JSON文件路径到历史记录
  };

  return (
    <Layout style={{ minHeight: "100vh", borderRadius: borderRadiusLG }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["home"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: "15px" }}>
          <Flex>
            <Typography>
              <Title level={5} style={{ margin: 0 }}>
                自然语言处理1119
              </Title>
              <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
                2024 年 11 月 29 日
              </Text>
            </Typography>
            <Select
              defaultValue={1}
              style={{ width: 120, right: 15, position: "absolute" }}
              onChange={handlePlaybackRateChange}
            >
              <Option value={0.5}>0.5x</Option>
              <Option value={1}>1x</Option>
              <Option value={1.5}>1.5x</Option>
              <Option value={2}>2x</Option>
            </Select>
          </Flex>
          <Splitter style={{ padding: "10px 0", height: "calc(100% - 50px)" }}>
            <Splitter.Panel defaultSize="60%" min="30%" max="70%">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: borderRadiusLG,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <Player
                  ref={playerRef}
                  src={videoSrc}
                  fluid={false}
                  width="100%"
                  height="100%"
                  style={{
                    borderRadius: borderRadiusLG,
                    objectFit: "contain",
                  }}
                  onTimeUpdate={handleTimeUpdate}
                />
              </div>
            </Splitter.Panel>
            <Splitter.Panel>
              <Flex
                align="flex-start"
                style={{
                  padding: 24,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                  height: "100%",
                  overflowY: "scroll",
                  flexDirection: "column",
                }}
              >
                {transcript.map((segment, segmentIndex) => (
                  <div key={segmentIndex} style={{ marginBottom: 16 }}>
                    {segment.map((item) => (
                      <span
                        key={item.timestamp}
                        onClick={() => handleTextClick(item.timestamp)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: isHighlighted(item.timestamp)
                            ? "rgba(24, 144, 255, 0.5)"
                            : "transparent",
                          borderRadius: 4,
                          display: "inline-block",
                        }}
                      >
                        {item.text}
                      </span>
                    ))}
                  </div>
                ))}
              </Flex>
            </Splitter.Panel>
          </Splitter>
        </Content>
        <Footer style={{ textAlign: "center", borderRadius: borderRadiusLG }}>
          录播小工具 ©{new Date().getFullYear()} Created by o0o0o0o
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;