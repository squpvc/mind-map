<h1 align="center">Simple mind map</h1>

[![npm-version](https://img.shields.io/npm/v/simple-mind-map)](https://www.npmjs.com/package/simple-mind-map)
![npm download](https://img.shields.io/npm/dm/simple-mind-map)
[![GitHub issues](https://img.shields.io/github/issues/wanglin2/mind-map)](https://github.com/wanglin2/mind-map/issues)
![license](https://img.shields.io/npm/l/express.svg)
[![GitHub stars](https://img.shields.io/github/stars/wanglin2/mind-map)](https://github.com/wanglin2/mind-map/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/wanglin2/mind-map)](https://github.com/wanglin2/mind-map/network/members)

> English Name: Mind Map. A simple & powerful web mind mapping library and mind mapping software.

This project mainly includes the following:

- A `js` mind map library that doesn't depend on any framework, which can be used to quickly develop web mind map products.

> Development Documentation: [https://wanglin2.github.io/mind-map-docs/](https://wanglin2.github.io/mind-map-docs/)

- A web-based mind map application, developed based on the mind map library, `Vue2.x`, and `ElementUI`. It supports operating local computer files and can be used as an online mind map application, or self-hosted and further developed.

> Online Address: [https://wanglin2.github.io/mind-map/](https://wanglin2.github.io/mind-map/)

- Client and Plugins

> 1. Standalone client, supporting Windows, Mac, and Linux systems.
>
> Download: [Github](https://github.com/wanglin2/mind-map/releases), [Baidu Netdisk](https://pan.baidu.com/s/1huasEbKsGNH2Af68dvWiOg?pwd=3bp3)

> 2. `uTools` plugin, now available in the [uTools](https://www.u.tools/) plugin marketplace.
>
> You can search for `Mind Map` in the `uTools` plugin marketplace to install, or directly visit this link: [Homepage](https://www.u-tools.cn/plugins/detail/%E6%80%9D%E7%BB%AA%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE/), and click the 【Start】 button on the right to install.

> 3. `obsidian` plugin, the first version has been released:
>
> Download: [https://github.com/wanglin2/obsidian-simplemindmap/releases](https://github.com/wanglin2/obsidian-simplemindmap/releases)

- Cloud storage version: If you need a version with backend cloud storage, you can try our other project [Ideal Document](https://github.com/wanglin2/lx-doc).

# Features

- [x] Plugin-based architecture, with core functionality and additional features provided as plugins for on-demand use, reducing bundle size
- [x] Supports various structures including logic diagrams (left, right), mind maps, organizational charts, directory organization charts, timelines (horizontal, vertical), fishbone diagrams, etc.
- [x] Built-in multiple themes, allowing highly customizable styles, supports registering new themes
- [x] Node content supports text (plain text, rich text), images, icons, hyperlinks, notes, tags, summaries, and mathematical formulas
- [x] Nodes support drag-and-drop (move, free adjustment), various node shapes; supports extending node content, fully customizable node content using DDM
- [x] Supports canvas dragging and zooming
- [x] Supports two methods for multi-selecting nodes: mouse button drag selection and Ctrl+left click
- [x] Supports exporting to `json`, `png`, `svg`, `pdf`, `markdown`, `xmind`, `txt`, and importing from `json`, `xmind`, `markdown`
- [x] Supports keyboard shortcuts, undo/redo, associative lines, search and replace, minimap, watermark, scrollbars, hand-drawn style, rainbow lines, markers, and borders
- [x] Provides rich configurations to meet various usage habits in different scenarios
- [x] Supports collaborative editing
- [x] Supports presentation mode
- [x] More features waiting for you to discover

The following official plugins are available and can be imported as needed (if a feature doesn't work, it's likely because you haven't imported the corresponding plugin). Please refer to the documentation for specific usage:

| RichText（节点富文本插件）           | Select（鼠标多选节点插件）                | Drag（节点拖拽插件）                 | AssociativeLine（关联线插件）        |
| ------------------------------------ | ----------------------------------------- | ------------------------------------ | ------------------------------------ |
| Export（导出插件）                   | KeyboardNavigation（键盘导航插件）        | MiniMap（小地图插件）                | Watermark（水印插件）                |
| TouchEvent（移动端触摸事件支持插件） | NodeImgAdjust（拖拽调整节点图片大小插件） | Search（搜索插件）                   | Painter（节点格式刷插件）            |
| Scrollbar（滚动条插件）              | Formula（数学公式插件）                   | Cooperate（协同编辑插件）            | RainbowLines（彩虹线条插件）         |
| Demonstrate（演示模式插件）          | OuterFrame（外框插件）                    | MindMapLayoutPro（思维导图布局插件） |                                      |

Features that will not be implemented in this project:

> 1. Free nodes, i.e., multiple root nodes;
>
> 2. Adding nodes after summary nodes;
>
> If you need the above features, this library may not meet your requirements.

# Installation

```bash
npm i simple-mind-map
```

# Usage

Provide a container element with non-zero width and height:

```html
<div id="mindMapContainer"></div>
```

Also, set up the `css` styles:

```css
#mindMapContainer * {
  margin: 0;
  padding: 0;
}
```

Then create an instance:

```js
import MindMap from "simple-mind-map";

const mindMap = new MindMap({
  el: document.getElementById("mindMapContainer"),
  data: {
    data: {
      text: "Root Node",
    },
    children: [],
  },
});
```

You'll get a mind map. Want to implement more features? Check out the [Development Documentation](https://wanglin2.github.io/mind-map-docs/).

# License

[MIT](./LICENSE). You can use it commercially as long as you retain the `simple-mind-map` copyright notice and indicate the source. If you have any questions or wish to remove these requirements, please contact the author for a paid option.

> Example: You can add the following content to any page in your application, such as the About page, Help page, Documentation page, Open Source Notice, etc.:
>
> The mind map in this product is developed based on the SimpleMindMap project. All rights belong to the original project, [Open Source License](https://github.com/wanglin2/mind-map/blob/main/LICENSE).

# WeChat Group

Add `wanglinguanfang` on WeChat to join the group. Based on past experience, most issues can be resolved by checking the issue list or documentation. Therefore, please make sure you've read all the documentation before asking questions. If your question isn't covered in the documentation, feel free to ask in the group instead of private messaging the author. If you must contact the author privately, please sponsor this project first (￥200+).

<table>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="http://drawon.cn/">
                <img src="./web/src/assets/img/gzh.jpeg" width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>WeChat Official Account</b></sub>
            </a>
        </td>
    </tr>
</table>

If you like this project, please give it a star. It means a lot to us.

[![Star History Chart](https://api.star-history.com/svg?repos=wanglin2/mind-map&type=Date)](https://star-history.com/#wanglin2/mind-map&Date)

# About Customization

If you have personalized commercial customization needs, you can contact us. We provide paid development services, whether it's frontend, backend, or deployment, we can help you with a one-stop solution.

# Who's Using This

<table>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="http://drawon.cn/">
                <img src="./web/src/assets/avatar/桌案.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>drawon.cn (桌案)</b></sub>
            </a>
        </td>
    </tr>
</table>

# Buy Me a Coffee

Open source is not easy. If this project has helped you, consider buying the author a coffee~ Your sponsorship is very important for the sustainable development of the project and is the greatest motivation for the author to continue maintenance.

> Alipay is recommended as WeChat cannot retrieve avatars. Please add the note 【Mind Map Sponsorship】 when transferring.

> Sponsorship Levels: Challenger (￥500+), Grandmaster (￥300+), Diamond (￥200+), Gold (￥100+), Bronze

<p>
  <img src="./web/src/assets/img/alipay.jpg" style="width: 300px" />
  <img src="./web/src/assets/img/wechat.jpg" style="width: 300px" />
</p>

## Challenger

<table>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/hi.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>hi</b></sub>
            </a>
        </td>
    </tr>
</table>

## Diamond Sponsors

<table>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/黄智彪@一米一栗科技.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>黄智彪@一米一栗科技</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/沨沄.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>沨沄</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/行.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>行</b></sub>
            </a>
        </td>
    </tr>
</table>

## Gold Sponsors

<table>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/小土渣的宇宙.jpeg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>小土渣的宇宙</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/Chris.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Chris</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/仓鼠.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>仓鼠</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/风格.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>风格</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>LiuJL</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/Kyle.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Kyle</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/秀树因馨雨.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>秀树因馨雨</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>黄泳</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/ccccs.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>ccccs</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/炫.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>炫</b></sub>
            </a>
        </td>
    </tr>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>晏江</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/梁辉.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>梁辉</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/千帆.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>千帆</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/布林.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>布林</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/达仁科技.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>达仁科技</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/沐风牧草.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>沐风牧草</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/俊奇.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>俊奇</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/庆国.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>庆国</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Matt</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/雨馨.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>雨馨</b></sub>
            </a>
        </td>
    </tr>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/峰.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>峰</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/御风.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>御风</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/兔子快跑.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>兔子快跑</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>LSHM</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>newplayer</b></sub>
            </a>
        </td>
    </tr>
</table>

## Bronze Sponsors

<table>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/Think.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Think</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/志斌.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>志斌</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/qp.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>qp</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/ZXR.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>ZXR</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/花儿朵朵.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>花儿朵朵</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/suka.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>suka</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/水车.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>水车</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/才镇.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>才镇</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/小米.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>小米bbᯤ²ᴳ</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/棐.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>*棐</b></sub>
            </a>
        </td>
    </tr>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/南风.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>南风</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/蜉蝣撼大叔.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>蜉蝣撼大叔</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/乙.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>乙</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/敏.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>敏</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/有希.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>有希</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/樊笼.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>樊笼</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/小逗比.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>小逗比</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/天清如愿.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>天清如愿</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/敬明朗.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>敬明朗</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>飞箭</b></sub>
            </a>
        </td>
    </tr>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/戚永峰.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>戚永峰</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/moom.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>moom</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/张扬.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>张扬</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/长沙利奥软件.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>长沙利奥软件</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/HaHN.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>HaHN</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/继龙.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>继龙</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/欣.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>欣</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>易空小易</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/国发.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>国发</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>建明</b></sub>
            </a>
        </td>
    </tr>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/汪津合.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>汪津合</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>博文</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/慕智打印-兰兰.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>慕智打印-兰兰</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>锦冰</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/旭东.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>旭东</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/橘半.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>橘半</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/pluvet.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>pluvet</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/皇登攀.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>皇登攀</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>SR</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/逆水行舟.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>逆水行舟</b></sub>
            </a>
        </td>
    </tr>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/L.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>L</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>sunniberg</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/在下青铜五.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>sunniberg</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/在下青铜五.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>在下青铜五</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/木星二号.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>木星二号</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/阿晨.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>阿晨</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>铁</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/Alex.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Alex</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/子豪.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>子豪</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/宏涛.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>宏涛</b></sub>
            </a>
        </td>
    </tr>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/最多5个字.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>最多5个字</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/ZX.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>ZX</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>协成</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/木木.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>木木</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/好名字.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>好名字</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/lsytyrt.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>lsytyrt</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/buddy.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>buddy</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>小川</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/Tobin.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Tobin</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/夏虫不语冰.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>夏虫不语冰</b></sub>
            </a>
        </td>
    </tr>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/晴空.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>晴空</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/。.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>。</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/Jeffrey.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Jeffrey</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/张文建.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>张文建</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/Lawliet.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Lawliet</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/一叶孤舟.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>一叶孤舟</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Eric</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/Joe.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Joe</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>中文网字计划-江夏尧</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/海云.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>海云</b></sub>
            </a>
        </td>
    </tr>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/皮老板.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>皮老板</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/h.r.w.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>h.r.w</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/时光匆匆.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>时光匆匆</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/广兴.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>广兴</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/一亩三.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>一亩三</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/xbkkjbs0246658.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>xbkkjbs0246658</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/4399行星元帅.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>4399行星元帅</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/Xavier.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Xavier</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/冒号括号.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>:)</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/可米阳光.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>可米阳光</b></sub>
            </a>
        </td>
    </tr>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/MrFujing.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>MrFujing</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/Sword.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Sword</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/好好先生Ervin.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>好好先生Ervin</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/胡永刚.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>胡永刚</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/旋风.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>旋风</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/星夜寒.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>星夜寒</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/神话.jpg" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>神话</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>Towards the future</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a href="#">
                <img src="./web/src/assets/avatar/default.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>安嘉</b></sub>
            </a>
        </td>
    </tr>
</table>