/**
 * 绘制雷达图
 * @param {Object} element 
 * @param {Object} DATA 
 * @author XiongWilee
 * @blog https://iblog.wilee.me
 * @date 2020-02-23
 * @copyright XiongWilee
 */
function radarChart(element, DATA) {
  const canvas = document.createElement("canvas");
  element.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // 高清屏适配
  const ratio = getRatio(ctx) || 1; // 屏幕分辨率
  const radius = element.offsetWidth * ratio / 2;
  canvas.width = canvas.height = radius * 2;
  canvas.style.width = canvas.style.height = radius + 'px';

  // 核心配置项
  const CFG = {
    r: radius, // 半径
    origin: [radius, radius], // 原点
    pieAngle: Math.PI * 2 / DATA.list.length, // 每个区块的角度
    dataList: [], // 数据点列表
    lastDataDot: {}, // 最后一个数据点
    bgPropor: 0.56, // 中心蜘蛛网占比
    bgCenPropor: 0.85, // 浅色环占比
    bgLevel: 5 // 蜘蛛网层次
  }

  // 绘制扇形区域
  drawFanshape(DATA, CFG)

  // 准备节点数据
  CFG.dataList = getPolygonPos(DATA, CFG);
  CFG.lastDataDot = CFG.dataList[CFG.dataList.length - 1];
  // 绘制蜘蛛网数据背景
  drawCobweb(DATA, CFG);
  // 绘制数据节点
  drawDataPoint(DATA, CFG);

  /**
   * 绘制扇形区域
   * @param {Object} DATA 
   * @param {Object} CFG 
   */
  function drawFanshape(DATA, CFG) {
    DATA.list.forEach((item, index) => {
      // 绘制外环
      let startAngle = CFG.pieAngle * index - Math.PI / 2;
      let stopAngle = CFG.pieAngle * (index + 1) - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(CFG.origin[0], CFG.origin[1]);
      ctx.arc(CFG.origin[0], CFG.origin[1], CFG.r, startAngle, stopAngle);
      ctx.fillStyle = item.ringColor;
      ctx.fill();
      ctx.restore();

      // 绘制中间浅色区域
      ctx.beginPath();
      ctx.moveTo(CFG.origin[0], CFG.origin[1]);
      ctx.arc(CFG.origin[0], CFG.origin[1], CFG.r * CFG.bgCenPropor, startAngle, stopAngle);
      ctx.fillStyle = item.ringBgColor;
      ctx.fill();
      ctx.restore();

      // 绘制title文字
      const titleRadius = (1 - (1 - CFG.bgCenPropor) / 2) * CFG.r;
      const titleAngle = startAngle + (stopAngle - startAngle) / 2 + Math.PI / 2;
      const titlePos = {
        x: titleRadius * Math.sin(titleAngle) + CFG.origin[0],
        y: -titleRadius * Math.cos(titleAngle) + CFG.origin[1]
      }
      ctx.save();
      ctx.font = `${(1 - CFG.bgCenPropor) * CFG.r / 2}px arial,sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.translate(titlePos.x, titlePos.y);
      if (titleAngle % (Math.PI / 2) === 0) {
        // 不做任何操作
      } else if (titlePos.x > CFG.r && titlePos.y < CFG.r) {
        ctx.rotate(titleAngle);
      } else if (titlePos.x > CFG.r && titlePos.y > CFG.r) {
        ctx.rotate(titleAngle - Math.PI);
      } else if (titlePos.x < CFG.r && titlePos.y > CFG.r) {
        ctx.rotate(titleAngle - Math.PI);
      } else if (titlePos.x < CFG.r && titlePos.y < CFG.r) {
        ctx.rotate(titleAngle);
      }
      ctx.fillText(item.name, 0, 0);
      ctx.restore();
    })
  }

  /**
   * 绘制数据节点
   * @param {Object} DATA 
   * @param {Object} CFG 
   */
  function drawDataPoint(DATA, CFG) {

    // 绘制数据节点
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.moveTo(CFG.lastDataDot.dataPos.x + CFG.origin[0], CFG.lastDataDot.dataPos.y + CFG.origin[1]);
    CFG.dataList.forEach(item => {
      ctx.lineTo(item.dataPos.x + CFG.origin[0], item.dataPos.y + CFG.origin[1]);
    });
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    CFG.dataList.forEach(item => {
      // 绘制数据点
      ctx.beginPath();
      ctx.arc(item.dataPos.x + CFG.origin[0], item.dataPos.y + CFG.origin[1], 4, 0, 2 * Math.PI);
      ctx.fillStyle = item.color;
      ctx.fill();

      // 绘制说明文字
      const dataAlias = {
        x: item.apex.x * 0.67 + CFG.origin[0],
        y: item.apex.y * 0.67 + CFG.origin[0]
      }
      const dataAliasRadius = CFG.r / 20;
      ctx.arc(dataAlias.x, dataAlias.y, dataAliasRadius, 0, 2 * Math.PI);
      ctx.fillStyle = item.color;
      ctx.fill();

      ctx.font = `${dataAliasRadius / 1.2}px arial,sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.value + item.suffix, dataAlias.x, dataAlias.y);
      ctx.restore();

      ctx.save();
      ctx.font = `${dataAliasRadius}px arial,sans-serif`;
      ctx.fillStyle = item.color;
      ctx.textAlign = 'center';
      let dataAliasPosY;
      if (dataAlias.y < CFG.r) {
        dataAliasPosY = dataAlias.y - 1.5 * dataAliasRadius;
      } else {
        dataAliasPosY = dataAlias.y + 2 * dataAliasRadius;
      }
      ctx.fillText(item.name, dataAlias.x, dataAliasPosY);
      ctx.restore();
    });
  }

  /**
   * 绘制蜘蛛网
   * @param {Object} DATA 
   * @param {Object} CFG 
   */
  function drawCobweb(DATA, CFG) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#EEEEEE';
    let curLevel = 0;
    while (curLevel++ < CFG.bgLevel) {
      let lastDot = CFG.lastDataDot.apex;
      let lastDotPos = {
        x: lastDot.x * CFG.bgPropor * curLevel / CFG.bgLevel + CFG.origin[0],
        y: lastDot.y * CFG.bgPropor * curLevel / CFG.bgLevel + CFG.origin[1]
      }
      ctx.moveTo(lastDotPos.x, lastDotPos.y);
      CFG.dataList.forEach(item => {
        let curDot = {
          x: item.apex.x * CFG.bgPropor * curLevel / CFG.bgLevel + CFG.origin[0],
          y: item.apex.y * CFG.bgPropor * curLevel / CFG.bgLevel + CFG.origin[1]
        }
        ctx.lineTo(curDot.x, curDot.y);
      })

      if (curLevel === CFG.bgLevel) {
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
    }
    CFG.dataList.forEach(item => {
      let curDot = {
        x: item.apex.x * CFG.bgPropor + CFG.origin[0],
        y: item.apex.y * CFG.bgPropor + CFG.origin[1]
      }
      ctx.moveTo(CFG.origin[0], CFG.origin[1]);
      ctx.lineTo(curDot.x, curDot.y);
    });
    ctx.stroke();
  }

  /**
  * 获取正多边形每个点的坐标位置数组（相对于原点）
  * DATA: 全局数据
  * CFG: 原点弧度
  */
  function getPolygonPos(DATA, CFG) {
    const dataList = []; // 多边形每个点的数据坐标数组

    DATA.list.forEach((item, index) => {
      let subPieAngle = CFG.pieAngle / item.data.length / 2;

      // 获取每个数据节点的关键数据
      const totalValue = 100; // 留一个接口用以判断总值
      item.data.forEach((subItem, subIndex) => {
        let rad = index * CFG.pieAngle + (subIndex * 2 + 1) * subPieAngle;

        let apex = {
          x: CFG.r * Math.sin(rad),
          y: -CFG.r * Math.cos(rad)
        }
        let dataPos = {
          x: apex.x * CFG.bgPropor * subItem.value / totalValue,
          y: apex.y * CFG.bgPropor * subItem.value / totalValue,
        }
        const dataItem = Object.assign({}, subItem, {
          total: totalValue,
          suffix: '%',
          color: item.ringColor,
          rad, // 弧度
          apex, // 顶点
          dataPos
        });
        console.log(dataItem);
        dataList.push(dataItem);
      })
    });

    return dataList;
  }

  /**
   * 获取屏幕分辨率
   * return Number
   **/
  function getRatio(ctx) {
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStorePixelRatio = ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1;
    var ratio = devicePixelRatio / backingStorePixelRatio;
    return ratio;
  }
}
