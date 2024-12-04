import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useHistory
} from 'react-router-dom'
import React, { useRef, useState, useEffect, useCallback, useMemo,useToken } from 'react'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  HomeOutlined,
  ArrowUpOutlined,
  ClockCircleFilled
} from '@ant-design/icons'
import {
  Layout,Avatar,
  Menu,
  theme,
  Typography,
  Splitter,
  Flex,
  Select,
  Button,
  message,
  Modal,
  Upload,
  ConfigProvider,List
} from 'antd'
import { Player } from 'video-react'
import 'video-react/dist/video-react.css'
const { Header, Content, Footer, Sider } = Layout
const { Title, Text } = Typography
const { Option } = Select


const StudyView = () => {

  const [currentTime, setCurrentTime] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [transcript, setTranscript] = useState([[]])
  const [showFloatingButton, setShowFloatingButton] = useState(false)
  const transcriptRef = useRef(null)
  const playerRef = useRef(null)
  const scrollTimerRef = useRef(null)
  const lastScrollY = useRef(0)
  const [videoFile, setVideoFile] = useState(null)
  const [jsonFile, setJsonFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [jsonUrl, setJsonUrl] = useState('')
  const [videoHistory, setVideoHistory] = useState([])

  // 上传文件时的回调
  const handleUpload = useCallback(info => {
    if (info.file.status === 'done') {
      console.log('上传成功:', info.file.response)
      // 假设返回的 response 中包含时间戳 JSON 数据
    }
  }, [])

  // 选择文件时保存路径
  const handleFileSelect = useCallback((file, type) => {
    if (type === 'video') {
      setVideoFile(file)
      setVideoUrl(URL.createObjectURL(file))
    } else if (type === 'json') {
      setJsonFile(file)
      setJsonUrl(URL.createObjectURL(file))
    }
  }, [])

  const fetchTranscript = async () => {
    try {
      const response = await fetch(jsonUrl)
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setTranscript(data)
    } catch (error) {
      console.error('Error fetching transcript:', error)
    }
  }

  useEffect(() => {
    fetchTranscript()
  }, [jsonUrl])

  const handleTimeUpdate = () => {
    const player = playerRef.current
    if (player) {
      setCurrentTime(player.getState().player.currentTime)
    }
  }

  const handlePlaybackRateChange = value => {
    setPlaybackRate(value)
    const player = playerRef.current
    if (player) player.video.playbackRate = value
  }

  const handleTextClick = timestamp => {
    const player = playerRef.current
    if (player) player.seek(timestamp)
  }


// 二分搜索函数
const binarySearch = (arr, target) => {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] > target) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return low; // 返回第一个大于 target 的元素索引
};

const isHighlighted = useMemo(() => {
  // 缓存并排序时间戳
  const timestamps = transcript.flat().map(item => item.timestamp).sort((a, b) => a - b);

  return timestamp => {
    const nextIndex = binarySearch(timestamps, timestamp);
    const nextTimestamp = nextIndex < timestamps.length ? timestamps[nextIndex] : Infinity;

    return currentTime >= timestamp && currentTime < nextTimestamp;
  };
}, [currentTime, transcript]);

  const handleScroll = () => {
    const transcriptDiv = transcriptRef.current
    if (!transcriptDiv) return

    const { scrollTop, scrollHeight, clientHeight } = transcriptDiv
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 50

    if (!scrolledToBottom) {
      setShowFloatingButton(true)
    } else {
      setShowFloatingButton(false)
    }

    lastScrollY.current = scrollTop
  }

  const scrollToHighlighted = () => {
    const highlightedElement = transcriptRef.current?.querySelector(
      'span[style*="rgba(24, 144, 255, 0.5)"]'
    )
    if (highlightedElement) {
      highlightedElement.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
    setShowFloatingButton(false)
  }

  useEffect(() => {
    const scrollToNextHighlight = () => {
      const transcriptDiv = transcriptRef.current
      if (!transcriptDiv) return

      const highlightedElement = transcriptDiv.querySelector(
        'span[style*="rgba(24, 144, 255, 0.5)"]'
      )
      if (highlightedElement) {
        const { bottom } = highlightedElement.getBoundingClientRect()
        const { bottom: containerBottom } =
          transcriptDiv.getBoundingClientRect()

        if (bottom > containerBottom - 50) {
          highlightedElement.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth'
          })
        }
      }
    }

    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)

    scrollTimerRef.current = setTimeout(scrollToNextHighlight, 500)

    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    }
  }, [currentTime])

  const [sizes, setSizes] = React.useState(['50%', '50%']);
  const [enabled, setEnabled] = React.useState(true);

  return (
    <Layout style={{ minHeight: '100%',  overflow:'hidden'}}>
   
        <Content style={{ padding:15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding:5 }}>
          <Typography>
            <Title level={4} style={{margin:0}}>课程回放助手</Title>
            <Text type='secondary' style={{padding:0}}>v1.0 · Powered by Ant Design</Text>
          </Typography>
          <div>
          <Select
            defaultValue={1}
            style={{ width: 120 }}
            onChange={handlePlaybackRateChange}
          >
            <Option value={0.5}>0.5x</Option>
            <Option value={1}>1x</Option>
            <Option value={1.5}>1.5x</Option>
            <Option value={2}>2x</Option>
            <Option value={2.5}>2.5x</Option>
            <Option value={3}>3x</Option>
          </Select>

          <Upload
                    beforeUpload={file => handleFileSelect(file, 'video')}
                    showUploadList={false}
                  >
                    <Button>选择视频文件</Button>
                  </Upload>
                  <Upload
                    beforeUpload={file => handleFileSelect(file, 'json')}
                    showUploadList={false}
                  >
                    <Button>选择JSON文件</Button>
                  </Upload>
                  </div>
        </div>
        <ConfigProvider
  theme={{
    components: {
      Splitter: {
        splitBarSize: 0,
        splitBarDraggableSize: 10,
        splitBarTriggerSize: 10,
      },
    },
  }}
>
  
        <Splitter  onResize={setSizes}  
        style={{ display: 'flex', height: 'calc(100vh - 100px)' , padding: 0,
          }}>
        
          <Splitter.Panel 
          style={{ flex: 1,background: 'white',
          borderRadius: 10,marginRight:5,overflow:"hidden",}}>
            <Player
              ref={playerRef}
              src={videoUrl}
              fluid={false}
              width='102%'
              height='100%'
              onTimeUpdate={handleTimeUpdate}
              
            />
          </Splitter.Panel>
          
          <Splitter.Panel defaultSize="35%" min="20%" max="60%"
            ref={transcriptRef}
            onScroll={handleScroll}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '15px',
              marginLeft: 5,
              border: '1px solid #ddd',
              borderRadius: '4px',
              height: '100%',
              background: 'white',
              borderRadius: 10,
            }}
          >
            {transcript.map((segment, segmentIndex) => (
              <div key={segmentIndex} style={{ marginBottom: '16px' }}>
     <List
    itemLayout="horizontal"
    >
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${segmentIndex % 8}`} />}
        title="Speaker"
        description=
          {segment.map((item, itemIndex) => (

            <span
              key={`${segmentIndex}-${itemIndex}-${item.timestamp}`}
              onClick={() => handleTextClick(item.timestamp)}
              style={{
                cursor: 'pointer',
                backgroundColor: isHighlighted(item.timestamp)
                  ? 'blue'
                  : 'transparent',
                color: isHighlighted(item.timestamp) 
                  ? 'white'
                  : "black",
                borderRadius: '4px',
                display: 'inline-block',
                letterSpacing:"0.02em",
              }}
            >
              {item.text}
            </span>
          ))}
        
      />
    </List.Item>
    </List>
                
              </div>
            ))}
          </Splitter.Panel>
        </Splitter>
        </ConfigProvider>
        </Content>
        {showFloatingButton && (
          <Button
            type='primary'
            icon={<ArrowUpOutlined />}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000
            }}
            onClick={scrollToHighlighted}
          >
            返回高亮
          </Button>
        )}
 
    </Layout>
  )
}

const App = () => {
 
  return (

      <Layout style={{ minHeight: '100vh' }}>
    


                    <StudyView  />

      </Layout>
  )
}

export default App