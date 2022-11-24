$(document).ready(() => {
  (function ValidateData() {  //Сначала проверить данные массива "data", важная практика при работе, например, со сторонними api
    if (w["series"][0]["data"]) {
      let sum = 0;
      let iterable;

      if(!Array.isArray(w["series"][0]["data"])){  //Проверить, является ли data массивом
        throw new Error("Unexpected type of data");
      } else iterable = w["series"][0]["data"];

      for(let i = 0; i < iterable.length; i++){
        if(!iterable[i].name){      //Проверить, есть ли в каждом из объектов в массиве ключ "name"
          if(iterable[i].names){
            iterable[i].name = iterable[i].names[0];    //Если его нет, но есть "names", взять "name" оттуда
            console.log(`name retrieved from names arr: ${iterable[i].names[0]}`);
          }
          console.warn(`data array element ${i} doesn't have a name`)
        }

        if(!iterable[i].y){  //Проверить, есть ли в каждом из объектов в массиве ключ "y"
          if(iterable[i].name){
            console.warn(`Slice ${iterable[i].name}'s value is undefined`);
          } else {
            console.warn(`Slice ${i}'s value is undefined`);
          }
        } else {
          if (!isNaN(iterable[i].y)) { //Проверить, является ли этот ключ числом
            sum += Number(iterable[i].y);
          } else {
            if(iterable[i].name){
              console.warn(`Slice ${iterable[i].name}'s value is not a number`);
            } else {
              console.warn(`Slice ${i}'s value is not a number`);
            }
          }
        }
      }
      if (Math.abs(100 - sum) > 0.01) {  //Проверить, равна ли сумма процентов 100 (с поправкой на погрешность)
        console.warn(
          `The sum doesn't add up to 100, difference: ${100 - sum}`
        );
      }
    } else {
      throw new Error("Data is undefined");
    }
  })();

  (function BuildChart() {  //Построить pie chart
    let chart = {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
    };
    let title = {
      text: "Распределение рынка браузеров, </br>2021",
    };
    let tooltip = {
      formatter() {
        return `${this.point.name}:</br> <b>${this.point.percentage.toFixed(
          1
        )}%</b>`;
      },
    };
    let plotOptions = {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",

        dataLabels: {
          enabled: false,
        },

        showInLegend: true,

      },
    };

    let series = [
      {
        type: "pie",
        name: "Browser share",
        data: w["series"][0]["data"],
      },
    ];
    let json = {};
    json.chart = chart;
    json.title = title;
    json.tooltip = tooltip;
    json.series = series;
    json.plotOptions = plotOptions;
    $("#container").highcharts(json);
  })();
});
