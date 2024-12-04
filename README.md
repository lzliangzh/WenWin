# WenWin

课程回放学习小工具

Study Tool for **THIS GENERATION**

“这一代”学习小工具，超越非输，实现稳赢。


## 说明

由于某书2024年12月开始每月只有300分钟免费额度，为保证顺利度过期末季，特仿制录播收看工具，供具有一定动手能力者利用，提高听课效率。

目前代码为前端界面，使用 Ant Design 构建，对某书播放界面在录播收看方面的必要功能还原性较佳。

> **说明：「必要功能」**
>
> 当前技术仍不能较好地完成部分专业性较强的课程的语音转写任务，使用 LLM 进行总结则可能遗漏掉课堂关键细节。因此对重要的课程，通览一遍回放仍有必要。
> 
> 一种正确打开方式是：
> - 2x倍速播放
> - 对照右侧识别结果预测老师要讲的内容，如果预测到了/觉得无聊，就跳过这几秒；如果字幕识别有问题，这几秒就听
> - 如此循环往复，跳跳跳跳。

### RoadMap

- [ ] 提供接入 Faster-Whisper 等语音转文字后端的接口。
  - 经测试，Faster-Whisper 的 large-v3 模型在 RTX 2070 笔记本上可以达到使用水平。
- [ ] 识别结果自动滚动机制、自动回滚焦点机制。
- [ ] 友好的录播存储或索引机制（历史记录功能）

## 使用方法

### 前端

```bash
npm i
npm start
```

访问 http://localhost:3000，按照界面提示上传视频和配套的文字 JSON 文件（格式见 `example.json`），即可开始学习。

#tag: Feishu minutes, 飞书, 妙记, 语音转文字, Speech to text, 录播, 回放, 课堂实录

### Waiting for your Contribution!