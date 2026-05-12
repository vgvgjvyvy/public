const fs = require("fs");
const path = require("path");

// 读取 data.json
const dataPath = path.join(__dirname, "data.json");
const rawData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// 构建层级结构
function buildRegionHierarchy(data) {
  // 按 type 分类
  const provinces = data.filter((item) => item.type === 0);
  const cities = data.filter((item) => item.type === 1);
  const districts = data.filter((item) => item.type === 2);

  // 创建映射
  const cityMap = {};
  cities.forEach((city) => {
    cityMap[city.code] = {
      text: city.name,
      children: [],
    };
  });

  const provinceMap = {};
  provinces.forEach((province) => {
    provinceMap[province.code] = {
      text: province.name,
      children: [],
    };
  });

  // 将城市分配给省份
  cities.forEach((city) => {
    if (city.parent_code && provinceMap[city.parent_code]) {
      provinceMap[city.parent_code].children.push(cityMap[city.code]);
    }
  });

  // 将区县分配给城市
  districts.forEach((district) => {
    if (district.parent_code && cityMap[district.parent_code]) {
      cityMap[district.parent_code].children.push({
        text: district.name,
      });
    }
  });

  // 构建最终结果
  const result = Object.values(provinceMap);

  return result;
}

// 生成 JS 文件内容
function generateJSContent(regionData) {
  return `export const regionData = ${JSON.stringify(regionData, null, 2)};\n`;
}

// 执行转换
console.log("开始转换...");
const regionData = buildRegionHierarchy(rawData);
const jsContent = generateJSContent(regionData);

// 写入 region-data.js
const outputPath = path.join(__dirname, "region-data.js");
fs.writeFileSync(outputPath, jsContent, "utf-8");

console.log("转换完成！");
console.log(`共生成 ${regionData.length} 个省份`);
console.log(`文件已保存到: ${outputPath}`);
