import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactSelectArray from "./build_components/buildDataComponents/ArrayControl";
import ReactSelectText from "./build_components/buildDataComponents/TextControl";
import ReactSelectOperation from "./build_components/buildDataComponents/OperationControl";
import "./css/input.css";
import standartTimeCalc from "./build_components/exeternalFunctions";
import ReactOptionCategory from "./build_components/buildDataComponents/OptionCategory";
import { use } from "react";

function InputData(props) {
  const property = props.property;

  // result from axios useState

  const [result, setResult] = useState("");

  //obj to store data

  const [obj, setObj] = useState({
    partName: "",
    partStTime: 0,
    piecec: [],
    subpiecec: [],
    category: [],
    option: [],
    operations: [],
  });

  // implement axios
  // console.log(postUrl(property));

  const postUrl = (property) => {
    const url = property;

    return "http://localhost:3000/" + url;
  };

  //and finaly post obj to mongodb

  let postData = async () => {
    console.log(obj);
    await axios
      .post(postUrl(property), obj)
      .then((response) => {
        setResult(JSON.stringify(response));
        console.log(response, property);
      })
      .catch((err) => {
        setResult(JSON.stringify(err.message));
        console.log(err.message);
      });
  };

  // handle inputs data

  // data from text input
  const handleDataFromText = (childData, name) => {
    if (childData) {
      setObj({ ...obj, partName: childData });
    }
  };

  // data from operations inputs

  const handleDataOperations = (childData, name) => {
    obj[name].push(childData);
    if (childData) {
      const set = standartTimeCalc(obj);
      console.log(set);
      setObj({ ...obj, partStTime: set });
      console.log(set);
    }
  };

  // data from React-Select input

  const handleDataSelect = (childData, name) => {
    obj[name].push(childData);
    if (childData) {
      setObj({ ...obj });
    }
  };

  // handle data from Option and category

  const [optionData, setOptionData] = useState({});
  const [categoryData, setCategoryData] = useState({});

  const handleOptCatData = (childData, name) => {
    if (name == "option") {
      setOptionData(childData);
    }
    if (name == "category") {
      setCategoryData(childData);
    }
  };

  // handle data to database from components - piece, subPiece, model

  const handleDb = (e) => {
    e.preventDefault();
    console.log("sendet", obj);
    postData(obj);
  };

  // handle data to database from option and

  let postOptCat = async (data, urlData) => {
    console.log(data, categoryData);
    await axios
      .post(urlData, data)
      .then((response) => {
        setResult(JSON.stringify(response));
        console.log(response, property);
      })
      .catch((err) => {
        setResult(JSON.stringify(err.message));
        console.log(err.message);
      });
  };

  function objectNotEmpty(object) {
    return Object.values(object) != 0;
  }

  const handleDbOptionCategory = (e) => {
    e.preventDefault();
    if (objectNotEmpty(optionData)) {
      console.log("sending");
      postOptCat(optionData, postUrl("option"));
      console.log("sendet", optionData, postUrl("option"));
    }
    if (objectNotEmpty(categoryData)) {
      console.log("sendet", categoryData, postUrl("category"));
      postOptCat(categoryData, postUrl("category"));
    }
    setOptionData({});
    setCategoryData({});
  };

  // first remove falsy(unused) keys from obj

  let delKeys = [];

  if (property == "piece") {
    delKeys = ["piecec", "subpiecec"];
    deleteObjKeys(obj, delKeys);
  } else if (property == "subpiece") {
    delKeys = ["stTime", "option", "subpiecec"];
    deleteObjKeys(obj, delKeys);
  } else if (property == "model") {
    delKeys = ["stTime", "category", "option"];
    deleteObjKeys(obj, delKeys);
  }

  function deleteObjKeys(o, arr) {
    arr.forEach((element) => {
      delete o[element];
    });
  }

  // component to render list of obj values

  const list = Object.values(obj).map((e, i) => {
    return <li key={i}>{JSON.stringify(e)}</li>;
  });

  // returning 3 elements depending on the property witch comes wit selected route

  const PieceElement = () => {
    return (
      <div className="buildPage">
        <div className="input">
          <ReactSelectText
            name={Object.keys(obj)[0]}
            handleData={handleDataFromText}
          />
          <ReactSelectText
            name={Object.keys(obj)[1]}
            num={Object.values(obj)[1]}
            settingFromParent={true}
          />
          <ReactSelectArray
            name={Object.keys(obj)[2]}
            handleData={handleDataSelect}
          />
          <ReactSelectArray
            name={Object.keys(obj)[3]}
            handleData={handleDataSelect}
          />
          <ReactSelectOperation
            name1={"operation"}
            name2={"stTime"}
            name={Object.keys(obj)[4]}
            handleData={handleDataOperations}
          />
          <p>{JSON.stringify(obj)}</p>
        </div>
        <div className="result">
          <p>{list}</p>
        </div>
        <button className="dataButton" onClick={handleDb}>
          Send To db
        </button>
        <p>{result}</p>
      </div>
    );
  };

  const SubPieceElemet = () => {
    return (
      <div className="buildPage">
        <div className="input">
          <ReactSelectText
            name={Object.keys(obj)[0]}
            handleData={handleDataFromText}
          />
          <ReactSelectText
            name={Object.keys(obj)[1]}
            num={Object.values(obj)[1]}
            settingFromParent={true}
          />
          <ReactSelectArray
            name={Object.keys(obj)[2]}
            handleData={handleDataSelect}
          />
          <ReactSelectArray
            name={Object.keys(obj)[3]}
            handleData={handleDataSelect}
          />
          <ReactSelectOperation
            name1={"operation"}
            name2={"stTime"}
            name={Object.keys(obj)[4]}
            handleData={handleDataOperations}
          />
        </div>
        <div className="result">
          <p>{list}</p>
        </div>
        <button className="dataButton" onClick={handleDb}>
          Send To db
        </button>
        <p>{result}</p>
      </div>
    );
  };

  const ModelElement = () => {
    return (
      <div className="buildPage">
        <div className="input">
          <ReactSelectText
            name={Object.keys(obj)[0]}
            handleData={handleDataFromText}
          />
          <ReactSelectText
            name={Object.keys(obj)[1]}
            num={Object.values(obj)[1]}
            settingFromParent={true}
          />

          <ReactSelectArray
            name={Object.keys(obj)[2]}
            handleData={handleDataSelect}
          />
          <ReactSelectArray
            name={Object.keys(obj)[3]}
            handleData={handleDataSelect}
          />
          <ReactSelectOperation
            name1={"operation"}
            name2={"stTime"}
            name={Object.keys(obj)[4]}
            handleData={handleDataOperations}
          />
        </div>
        <div className="result">
          <p>{list}</p>
        </div>
        <button className="dataButton" onClick={handleDb}>
          Send To db
        </button>
        <p>{result}</p>
      </div>
    );
  };

  const OptionResult = () => {
    return (
      <div>
        <div className="OptCat">
          <h4 className="heading">Option data</h4>
          <p className="myInput">Name: {optionData.name}</p>
          <p className="myInput">Value: {optionData.value}</p>
        </div>
        <div className="OptCat">
          <h4 className="heading">Category data</h4>
          <p className="myInput">Name: {categoryData.name}</p>
          <p className="myInput">Value: {categoryData.value}</p>
        </div>
      </div>
    );
  };

  const OptionCategory = () => {
    return (
      <div className="buildPage">
        <div className="input">
          <ReactOptionCategory handleData={handleOptCatData} />
        </div>
        <div className="result">
          <OptionResult />
        </div>
        <button className="dataButton" onClick={handleDbOptionCategory}>
          Send To db
        </button>
      </div>
    );
  };

  if (property == "piece") {
    return <PieceElement />;
  } else if (property == "subpiece") {
    return <SubPieceElemet />;
  } else if (property == "model") {
    return <ModelElement />;
  } else if (property == "optionCategory") {
    return <OptionCategory />;
  }
}

export default InputData;
