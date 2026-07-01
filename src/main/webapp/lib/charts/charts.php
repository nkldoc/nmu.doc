<?php
class Charts
{

    protected function utf8_converter($array)
    {
        // array_walk_recursive($array, function (&$item, $key) {
        //     if (!mb_detect_encoding($item, 'utf-8', true)) {
        //         $item = iconv('TIS-620', 'utf-8',$item);
        //     }
        // });

        // return $array;
    }
    public function BarChart(
        $chart_element_id = "",
        $title_text = "",
        $title_subtext = "",
        $title_align = "",
        $backgroundColor = "",
        $legend_data = array(),
        $legend_color = array(),
        $yAxis_name = "",
        $one_bar = false,
        $show_bar_label = false,
        $label_to_percen = false,
        $position_bar_label = array(),
        $data = array(),
        $bar_lable_property = ""
    ) {
        $chart_element_id = $chart_element_id;
        $chart_name = str_replace('-', '_', $chart_element_id);
        $title_text = $title_text != "" ? $title_text : '';
        $subtext = $title_subtext != "" ? $title_subtext : '';
        $title_align = $title_align != "" ? $title_align : 'center';
        $backgroundColor = $backgroundColor != "" ? $backgroundColor : '#FFFFFF';
        $legend_data = $legend_data != ""  ? $legend_data : array();
        $legend_color = $legend_color != ""  ? $legend_color : array("#516b91", "#59c4e6", "#edafda", "#93b7e3", "#a5e7f0", "#cbb0e3");
        $yAxis_name = $yAxis_name != ""  ? $yAxis_name : '(หน่วย)';
        $one_bar = $one_bar != ""  ? $one_bar : false;
        $show_bar_label = $show_bar_label != ""  ? $show_bar_label : false;
        $label_to_percen = $label_to_percen != ""  ? $label_to_percen : false;
        $position_bar_label = $position_bar_label != ""  ? $position_bar_label : array("inside");
        $data = $data != "" ? $data : array();
        $xAxis_data = array();
        $data_value = array();
        foreach ($data as $index => $row) {
            $xAxis_data[] = $row["name"];
        }

        $row_value = array();
        for ($i = 1; $i <= @count(@$data[0]) - 1; $i++) {
            $row_value = array();
            for ($j = 0; $j < count($data); $j++) {
                $row_value[] = $data[$j]["value" . $i];
            }
            $data_value[] = $row_value;
        }
        $row_sum = array();
        for ($i = 0; $i < @count(@$data_value[0]); $i++) {
            $iii = 0;
            for ($j = 0; $j < count($data_value); $j++) {
                $iii += $data_value[$j][$i];
            }
            $row_sum[] = $iii;
        }
        $data_row_per = '';
        for ($j = 1; $j <= count($data_value); $j++) {
            $data_row_per .= '+data[pos]["value' . $j . '"]';
        }
        // print_r($row_sum);
        $index_data = 0;
        $series = '';
        foreach ($data_value as $row) {
            $series .= ',{
                name: "' . @$legend_data[$index_data] . '",
                color: "' . @$legend_color[$index_data] . '",
                type: "bar",
                stack: "' . ($one_bar ? '1' : $index_data) . '",
                emphasis: emphasisStyle,
                label: {
                    show: ' . ($show_bar_label ? 'true' : 'false') . ',
                    position: "' . $position_bar_label[$index_data] . '",
                    ' . $bar_lable_property . '
                    formatter: function(params) {
                        var pos = data.map(function(e) {
                            return e.name;
                        }).indexOf(params.name);
                        ' . ($label_to_percen ? 'return (data[pos]["value' . ($index_data + 1) . '"] / (' . substr($data_row_per, 1) . ') * 100).toFixed(0) + "%"' : '') . '
                        ' . ($label_to_percen ? '' : 'return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")') . '



                    },
                },
                data: ' . json_encode($row) . '
            }';
            ++$index_data;
        }

        echo '
        <script>';
        echo '	
            var chart = document.getElementById("' . $chart_element_id . '");
            var myChart_' . $chart_name . ' = echarts.init(chart);
            var app = {};
            var data = ' . json_encode($data) . ';
            var sum_row = 0;';

        echo '
            var emphasisStyle = {
                itemStyle: {
                    barBorderWidth: 1,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowColor: "rgba(0,0,0,0.5)"
                }
            };';
        echo '	
            option = {
                title: {
                    text: "' . $title_text . '",
                    subtext: "' . $subtext . '",
                    left: "' . $title_align . '",
                    textStyle: {
                        color: "#000000"
                    }
                },
                backgroundColor: "' . $backgroundColor . '",
                legend: {
                    data: ' . json_encode($legend_data) . ',
                    left: 10
                },
                tooltip: {},
                xAxis: {
                    data: ' . json_encode($xAxis_data) . ',
                    axisLine: {
                        onZero: true
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: true,
                        areaStyle:{
                            color:["rgba(250,250,250,0.2)","rgba(210,219,238,0.3)"]
                        }
                    },
                    axisLabel: { 
                        interval: 0,
                        rotate: 30,
                    }
                },
                yAxis: {
                    name: "' . $yAxis_name . '",
                    inverse: false,
                    splitArea: {
                        show: false
                    }
                },
                grid: {
                    left: 100
                },
                series: [
                    ' . substr($series, 1) . '
                ]
            };

        ';
        echo 'if (option && typeof option === "object") {
            myChart_' . $chart_name . '.setOption(option, true);
        }';
        echo '</script>';
    }
    public function PieChart(
        $chart_element_id = "",
        $title_text = "",
        $title_subtext = "",
        $title_align = "",
        $backgroundColor = "",
        $radius = "",
        $show_bar_label = false,
        $position_bar_label = array(),
        $data = array()
    ) {

        $chart_element_id = $chart_element_id;
        $chart_name = str_replace('-', '_', $chart_element_id);
        $title_text = $title_text != "" ? $title_text : '';
        $subtext = $title_subtext != "" ? $title_subtext : '';
        $title_align = $title_align != "" ? $title_align : 'center';
        $backgroundColor = $backgroundColor != "" ? $backgroundColor : '#FFFFFF';
        $radius = $radius != "" ? $radius : '50%';
        $show_bar_label = $show_bar_label != ""  ? $show_bar_label : false;
        $position_bar_label = $position_bar_label != ""  ? $position_bar_label : array("inside");
        $data = $data != "" ? $data : array();

        if (is_array($data)) {
            $j_data = '';
            foreach ($data as $key => $arr) {
                $j_data .= ', {name : "' . $arr["name"] . '", value: "' . $arr["value"] . '"}';
            }
            $j_data = substr($j_data, 1);
        }

        echo '
        <script>
            var chart = document.getElementById("' . $chart_element_id . '");
            var myChart_' . $chart_name . ' = echarts.init(chart, "macarons");
            var data = [' . $j_data . '];

            var total = 0
            data.forEach(item => {total += (item.value-0);});

            var option = {
                backgroundColor: "' . $backgroundColor . '",
                title: {
                    text: "' . $title_text . '",
                    subtext: "' . $subtext . '",
                    left: "' . $title_align . '",
                    textStyle: {
                        fontSize: 15,
                        lineHeight: 20,
                        color: "#000000"

                    },
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    bottom: 10,
                    data: data,
                    orient: "vertical",
                    left: "right",
                    formatter: function(params) {
                        var pos = data.map(function(e) {
                            return e.name;
                        }).indexOf(params);
                        return data[pos]["name"] + " : " + (data[pos]["value"] / total * 100).toFixed(2) + "%";
                        //return (data[pos]["value"] / total * 100).toFixed(2) + "%";
                    },
                },
                series: [{
                    name: "",
                    type: "pie",
                    radius: "' . $radius . '",
                    selectedMode: "single",
                    // label: {
                    //     show: ' . ($show_bar_label ? 'true' : 'false') . ',
                    //     // position: "' . $position_bar_label[0] . '",
                    //     formatter: function(params) {
                    //         return (params.value / total * 100).toFixed(2) + "%";
                    //     },
                    // },
                    // label: {
                    // 	position: "inner"
                    // },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    },
                    data: data
                }]
            };
            myChart_' . $chart_name . '.setOption(option);
        </script>
        ';
    }
}
