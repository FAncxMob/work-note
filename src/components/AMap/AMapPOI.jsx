import React, { useState, useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Input } from 'antd';

const AMapPOI = (props) => {
  const [placeSearch, setPlaceSearch] = useState(null);
  const [addressInfo, setAddressInfo] = useState(null);

  const {
    mapStyle = {
      height: '500px',
    },
    onChange = () => {},
    addressValue: value,
  } = props;

  function getPOIList(keyword) {
    placeSearch.search(keyword, function () {
      // 搜索成功时，result即是对应的匹配数据
    });
  }

  function handleChange(data) {
    setAddressInfo(data);
    onChange(data);
  }

  useEffect(() => {
    AMapLoader.load({
      key: 'fb81516c8130ca5d72c3323ea03f2c58', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.CitySearch'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap) => {
        const { location: { lat = '', lng = '' } = {} } = value || {};

        let center = [lng, lat];
        if (!lat && !lng) {
          center = null;
        }
        const map = new AMap.Map('AMap-container', {
          resizeEnable: true,
          center,
          zoom: 13,
        });

        const search = new AMap.PlaceSearch({
          pageSize: 20,
          map,
          panel: 'panel',
        });

        // 如果有中心点
        if (center) {
          const marker = new AMap.Marker({
            position: center,
          });
          map.add(marker);
        }

        // 添加列表点击事件
        AMap.event.addListener(search, 'listElementClick', function (e) {
          handleChange(e.data);
        });
        // 添加marker点击事件
        AMap.event.addListener(search, 'markerClick', function (e) {
          handleChange(e.data);
        });

        setPlaceSearch(search);
      })
      .catch((e) => {
        console.log(e);
      });

    return function () {
      console.log('cancel');
    };
  }, []);

  useEffect(() => {
    setAddressInfo(value);
  }, [value]);

  function getAddress(info) {
    if (!info) return '';
    const { pname = '', cityname = '', adname = '', address = '' } = info;
    return `${pname}${cityname}${adname}${address}`;
  }
  return (
    <>
      <Input className="mb15" disabled value={getAddress(addressInfo)} />
      <div className="por">
        <div id="AMap-container" style={mapStyle} />
        <div className="poa top0">
          <Input
            placeholder="请输入关键字"
            onChange={(e) => {
              getPOIList(e.target.value);
            }}
          />
        </div>
        <div
          id="panel"
          className="poa top0 right0 h100p w400"
          style={{ overflow: 'auto', transform: 'translateX(100%)' }}
        />
        <div />
      </div>
    </>
  );
};

export default AMapPOI;
