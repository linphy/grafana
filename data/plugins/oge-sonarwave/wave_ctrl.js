'use strict';

System.register(['app/plugins/sdk', 'lodash', 'vendor/echarts/echarts.min.js', 'jquery', 'vendor/wavesurfer/wavesurfer.js', 'vendor/wavesurfer/wavesurfer.spectrogram.js', 'vendor/wavesurfer/wavesurfer.timeline.js'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, _, echarts, $, WaveSurfer, SpectrogramPlugin, Timeline, _typeof, _createClass, panelDefaults, domFunctionOnce, currentDropdown, wavesurfers, colors, WaveCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_appPluginsSdk) {
            MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
        }, function (_lodash) {
            _ = _lodash.default;
        }, function (_vendorEchartsEchartsMinJs) {
            echarts = _vendorEchartsEchartsMinJs.default;
        }, function (_jquery) {
            $ = _jquery.default;
        }, function (_vendorWavesurferWavesurferJs) {
            WaveSurfer = _vendorWavesurferWavesurferJs.default;
        }, function (_vendorWavesurferWavesurferSpectrogramJs) {
            SpectrogramPlugin = _vendorWavesurferWavesurferSpectrogramJs.default;
        }, function (_vendorWavesurferWavesurferTimelineJs) {
            Timeline = _vendorWavesurferWavesurferTimelineJs.default;
        }],
        execute: function () {
            _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                return typeof obj;
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };

            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            panelDefaults = {
                tabIsShow: true, //是否显示标签页
                sfCoefficient: 10000, //频域乘法系数
                sfTempCoefficient: 10000, //频域乘法系数
                tabIndex: "ST", //显示哪一个标签页, 获取波形的什么数据
                timeIndex: 0, //默认数据索引
                showType: false,
                tabOptions: {
                    "ST": {
                        ind: 0,
                        name: "声纳时域波形",
                        value: "ST",
                        oldVariableText: "",
                        selectedValues: [],
                        selectTargets: [],
                        query: "",
                        dropdownVisible: false,
                        tempInfo: "请选择数据",
                        variable: {
                            current: {
                                text: "请选择kks",
                                value: ""
                            },
                            options: [],
                            multi: true,
                            search: {}
                        }
                    },
                    "SF": {
                        ind: 1,
                        name: "声纳频域波形",
                        value: "SF",
                        oldVariableText: "",
                        selectedValues: [],
                        selectTargets: [],
                        query: "",
                        dropdownVisible: false,
                        tempInfo: "请选择数据",
                        variable: {
                            current: {
                                text: "请选择kks",
                                value: ""
                            },
                            options: [],
                            multi: true,
                            search: {}
                        }
                    },
                    "SX": {
                        ind: 2,
                        name: "声纳时频域波形",
                        value: "SX",
                        oldVariableText: "",
                        selectedValues: [],
                        selectTargets: [],
                        query: "",
                        dropdownVisible: false,
                        tempInfo: "请选择数据",
                        variable: {
                            current: {
                                text: "请选择kks",
                                value: ""
                            },
                            options: [],
                            multi: true,
                            search: {}
                        }
                    }
                }
            };
            domFunctionOnce = true;
            currentDropdown = "";
            wavesurfers = [];
            colors = [[0, 0, 0.5137254901960784, 1], [0, 0.00784313725490196, 0.5176470588235295, 1], [0, 0.01568627450980392, 0.5215686274509804, 1], [0, 0.023529411764705882, 0.5294117647058824, 1], [0, 0.03137254901960784, 0.5333333333333333, 1], [0, 0.03529411764705882, 0.5372549019607843, 1], [0, 0.043137254901960784, 0.5411764705882353, 1], [0, 0.050980392156862744, 0.5490196078431373, 1], [0, 0.058823529411764705, 0.5529411764705883, 1], [0, 0.06666666666666667, 0.5568627450980392, 1], [0, 0.07450980392156863, 0.5607843137254902, 1], [0, 0.08235294117647059, 0.5647058823529412, 1], [0, 0.09019607843137255, 0.5725490196078431, 1], [0, 0.09411764705882353, 0.5764705882352941, 1], [0, 0.10196078431372549, 0.5803921568627451, 1], [0, 0.10980392156862745, 0.5843137254901961, 1], [0, 0.11764705882352941, 0.592156862745098, 1], [0, 0.12549019607843137, 0.596078431372549, 1], [0, 0.13333333333333333, 0.6, 1], [0, 0.1411764705882353, 0.6039215686274509, 1], [0, 0.14901960784313725, 0.6078431372549019, 1], [0, 0.15294117647058825, 0.615686274509804, 1], [0, 0.1607843137254902, 0.6196078431372549, 1], [0, 0.16862745098039217, 0.6235294117647059, 1], [0, 0.17647058823529413, 0.6274509803921569, 1], [0, 0.1843137254901961, 0.6313725490196078, 1], [0, 0.19215686274509805, 0.6392156862745098, 1], [0, 0.2, 0.6431372549019608, 1], [0, 0.20784313725490197, 0.6470588235294118, 1], [0, 0.21176470588235294, 0.6509803921568628, 1], [0, 0.2196078431372549, 0.6588235294117647, 1], [0, 0.22745098039215686, 0.6627450980392157, 1], [0, 0.23529411764705882, 0.6666666666666666, 1], [0, 0.24705882352941178, 0.6705882352941176, 1], [0, 0.25882352941176473, 0.6784313725490196, 1], [0, 0.27058823529411763, 0.6823529411764706, 1], [0, 0.2823529411764706, 0.6862745098039216, 1], [0, 0.29411764705882354, 0.6941176470588235, 1], [0, 0.3058823529411765, 0.6980392156862745, 1], [0.00392156862745098, 0.3176470588235294, 0.7019607843137254, 1], [0.00392156862745098, 0.32941176470588235, 0.7098039215686275, 1], [0.00392156862745098, 0.3411764705882353, 0.7137254901960784, 1], [0.00392156862745098, 0.35294117647058826, 0.7176470588235294, 1], [0.00392156862745098, 0.3686274509803922, 0.7254901960784313, 1], [0.00392156862745098, 0.3803921568627451, 0.7294117647058823, 1], [0.00392156862745098, 0.39215686274509803, 0.7333333333333333, 1], [0.00392156862745098, 0.403921568627451, 0.7411764705882353, 1], [0.00392156862745098, 0.41568627450980394, 0.7450980392156863, 1], [0.00392156862745098, 0.42745098039215684, 0.7490196078431373, 1], [0.00392156862745098, 0.4392156862745098, 0.7568627450980392, 1], [0.00392156862745098, 0.45098039215686275, 0.7607843137254902, 1], [0.00392156862745098, 0.4627450980392157, 0.7647058823529411, 1], [0.00784313725490196, 0.4745098039215686, 0.7725490196078432, 1], [0.00784313725490196, 0.48627450980392156, 0.7764705882352941, 1], [0.00784313725490196, 0.4980392156862745, 0.7803921568627451, 1], [0.00784313725490196, 0.5098039215686274, 0.788235294117647, 1], [0.00784313725490196, 0.5215686274509804, 0.792156862745098, 1], [0.00784313725490196, 0.5333333333333333, 0.796078431372549, 1], [0.00784313725490196, 0.5450980392156862, 0.803921568627451, 1], [0.00784313725490196, 0.5568627450980392, 0.807843137254902, 1], [0.00784313725490196, 0.5686274509803921, 0.8117647058823529, 1], [0.00784313725490196, 0.5803921568627451, 0.8196078431372549, 1], [0.00784313725490196, 0.592156862745098, 0.8235294117647058, 1], [0.00784313725490196, 0.6039215686274509, 0.8274509803921568, 1], [0.011764705882352941, 0.6196078431372549, 0.8352941176470589, 1], [0.011764705882352941, 0.6313725490196078, 0.8392156862745098, 1], [0.011764705882352941, 0.6431372549019608, 0.8431372549019608, 1], [0.011764705882352941, 0.6549019607843137, 0.8470588235294118, 1], [0.011764705882352941, 0.6666666666666666, 0.8549019607843137, 1], [0.011764705882352941, 0.6784313725490196, 0.8588235294117647, 1], [0.011764705882352941, 0.6901960784313725, 0.8627450980392157, 1], [0.011764705882352941, 0.7019607843137254, 0.8705882352941177, 1], [0.011764705882352941, 0.7137254901960784, 0.8745098039215686, 1], [0.011764705882352941, 0.7254901960784313, 0.8784313725490196, 1], [0.011764705882352941, 0.7372549019607844, 0.8862745098039215, 1], [0.011764705882352941, 0.7490196078431373, 0.8901960784313725, 1], [0.011764705882352941, 0.7607843137254902, 0.8941176470588236, 1], [0.01568627450980392, 0.7725490196078432, 0.9019607843137255, 1], [0.01568627450980392, 0.7843137254901961, 0.9058823529411765, 1], [0.01568627450980392, 0.796078431372549, 0.9098039215686274, 1], [0.01568627450980392, 0.807843137254902, 0.9176470588235294, 1], [0.01568627450980392, 0.8196078431372549, 0.9215686274509803, 1], [0.01568627450980392, 0.8313725490196079, 0.9254901960784314, 1], [0.01568627450980392, 0.8431372549019608, 0.9333333333333333, 1], [0.01568627450980392, 0.8549019607843137, 0.9372549019607843, 1], [0.01568627450980392, 0.8666666666666667, 0.9411764705882353, 1], [0.01568627450980392, 0.8823529411764706, 0.9490196078431372, 1], [0.01568627450980392, 0.8941176470588236, 0.9529411764705882, 1], [0.01568627450980392, 0.9058823529411765, 0.9568627450980393, 1], [0.01568627450980392, 0.9176470588235294, 0.9647058823529412, 1], [0.0196078431372549, 0.9294117647058824, 0.9686274509803922, 1], [0.0196078431372549, 0.9411764705882353, 0.9725490196078431, 1], [0.0196078431372549, 0.9529411764705882, 0.9803921568627451, 1], [0.0196078431372549, 0.9647058823529412, 0.984313725490196, 1], [0.0196078431372549, 0.9764705882352941, 0.9882352941176471, 1], [0.0196078431372549, 0.9882352941176471, 0.996078431372549, 1], [0.0196078431372549, 1, 1, 1], [0.03529411764705882, 1, 0.984313725490196, 1], [0.050980392156862744, 1, 0.9686274509803922, 1], [0.06666666666666667, 1, 0.9529411764705882, 1], [0.08235294117647059, 1, 0.9372549019607843, 1], [0.09803921568627451, 1, 0.9215686274509803, 1], [0.11372549019607843, 1, 0.9058823529411765, 1], [0.12941176470588237, 1, 0.8901960784313725, 1], [0.1450980392156863, 1, 0.8745098039215686, 1], [0.1607843137254902, 1, 0.8588235294117647, 1], [0.17647058823529413, 1, 0.8431372549019608, 1], [0.19215686274509805, 1, 0.8235294117647058, 1], [0.20784313725490197, 1, 0.807843137254902, 1], [0.2235294117647059, 1, 0.792156862745098, 1], [0.23921568627450981, 1, 0.7764705882352941, 1], [0.2549019607843137, 1, 0.7607843137254902, 1], [0.26666666666666666, 1, 0.7450980392156863, 1], [0.2823529411764706, 1, 0.7294117647058823, 1], [0.2980392156862745, 1, 0.7137254901960784, 1], [0.3137254901960784, 1, 0.6980392156862745, 1], [0.32941176470588235, 1, 0.6823529411764706, 1], [0.34509803921568627, 1, 0.6666666666666666, 1], [0.3607843137254902, 1, 0.6509803921568628, 1], [0.3764705882352941, 1, 0.6352941176470588, 1], [0.39215686274509803, 1, 0.6196078431372549, 1], [0.40784313725490196, 1, 0.6039215686274509, 1], [0.4235294117647059, 1, 0.5882352941176471, 1], [0.4392156862745098, 1, 0.5725490196078431, 1], [0.4549019607843137, 1, 0.5568627450980392, 1], [0.47058823529411764, 1, 0.5411764705882353, 1], [0.48627450980392156, 1, 0.5254901960784314, 1], [0.5019607843137255, 1, 0.5098039215686274, 1], [0.5176470588235295, 1, 0.49019607843137253, 1], [0.5333333333333333, 1, 0.4745098039215686, 1], [0.5490196078431373, 1, 0.4588235294117647, 1], [0.5647058823529412, 1, 0.44313725490196076, 1], [0.5803921568627451, 1, 0.42745098039215684, 1], [0.596078431372549, 1, 0.4117647058823529, 1], [0.611764705882353, 1, 0.396078431372549, 1], [0.6274509803921569, 1, 0.3803921568627451, 1], [0.6431372549019608, 1, 0.36470588235294116, 1], [0.6588235294117647, 1, 0.34901960784313724, 1], [0.6745098039215687, 1, 0.3333333333333333, 1], [0.6901960784313725, 1, 0.3176470588235294, 1], [0.7058823529411765, 1, 0.30196078431372547, 1], [0.7215686274509804, 1, 0.28627450980392155, 1], [0.7372549019607844, 1, 0.27058823529411763, 1], [0.7529411764705882, 1, 0.2549019607843137, 1], [0.7647058823529411, 1, 0.23921568627450981, 1], [0.7803921568627451, 1, 0.2235294117647059, 1], [0.796078431372549, 1, 0.20784313725490197, 1], [0.8117647058823529, 1, 0.19215686274509805, 1], [0.8274509803921568, 1, 0.17647058823529413, 1], [0.8431372549019608, 1, 0.1568627450980392, 1], [0.8588235294117647, 1, 0.1411764705882353, 1], [0.8745098039215686, 1, 0.12549019607843137, 1], [0.8901960784313725, 1, 0.10980392156862745, 1], [0.9058823529411765, 1, 0.09411764705882353, 1], [0.9215686274509803, 1, 0.0784313725490196, 1], [0.9372549019607843, 1, 0.06274509803921569, 1], [0.9529411764705882, 1, 0.047058823529411764, 1], [0.9686274509803922, 1, 0.03137254901960784, 1], [0.984313725490196, 1, 0.01568627450980392, 1], [1, 1, 0, 1], [1, 0.984313725490196, 0, 1], [1, 0.9686274509803922, 0, 1], [1, 0.9529411764705882, 0, 1], [1, 0.9372549019607843, 0, 1], [1, 0.9215686274509803, 0, 1], [1, 0.9058823529411765, 0, 1], [0.996078431372549, 0.8901960784313725, 0, 1], [0.996078431372549, 0.8745098039215686, 0, 1], [0.996078431372549, 0.8588235294117647, 0, 1], [0.996078431372549, 0.8431372549019608, 0, 1], [0.996078431372549, 0.8274509803921568, 0, 1], [0.996078431372549, 0.8117647058823529, 0, 1], [0.996078431372549, 0.796078431372549, 0, 1], [0.996078431372549, 0.7803921568627451, 0, 1], [0.996078431372549, 0.7647058823529411, 0, 1], [0.996078431372549, 0.7490196078431373, 0, 1], [0.996078431372549, 0.7333333333333333, 0, 1], [0.996078431372549, 0.7176470588235294, 0, 1], [0.996078431372549, 0.7019607843137254, 0, 1], [0.9921568627450981, 0.6862745098039216, 0, 1], [0.9921568627450981, 0.6705882352941176, 0, 1], [0.9921568627450981, 0.6549019607843137, 0, 1], [0.9921568627450981, 0.6392156862745098, 0, 1], [0.9921568627450981, 0.6235294117647059, 0, 1], [0.9921568627450981, 0.6078431372549019, 0, 1], [0.9921568627450981, 0.592156862745098, 0, 1], [0.9921568627450981, 0.5764705882352941, 0, 1], [0.9921568627450981, 0.5607843137254902, 0, 1], [0.9921568627450981, 0.5450980392156862, 0, 1], [0.9921568627450981, 0.5294117647058824, 0, 1], [0.9921568627450981, 0.5137254901960784, 0, 1], [0.9921568627450981, 0.5019607843137255, 0, 1], [0.9882352941176471, 0.48627450980392156, 0, 1], [0.9882352941176471, 0.47058823529411764, 0, 1], [0.9882352941176471, 0.4549019607843137, 0, 1], [0.9882352941176471, 0.4392156862745098, 0, 1], [0.9882352941176471, 0.4235294117647059, 0, 1], [0.9882352941176471, 0.40784313725490196, 0, 1], [0.9882352941176471, 0.39215686274509803, 0, 1], [0.9882352941176471, 0.3764705882352941, 0, 1], [0.9882352941176471, 0.3607843137254902, 0, 1], [0.9882352941176471, 0.34509803921568627, 0, 1], [0.9882352941176471, 0.32941176470588235, 0, 1], [0.9882352941176471, 0.3137254901960784, 0, 1], [0.984313725490196, 0.2980392156862745, 0, 1], [0.984313725490196, 0.2823529411764706, 0, 1], [0.984313725490196, 0.26666666666666666, 0, 1], [0.984313725490196, 0.25098039215686274, 0, 1], [0.984313725490196, 0.23529411764705882, 0, 1], [0.984313725490196, 0.2196078431372549, 0, 1], [0.984313725490196, 0.20392156862745098, 0, 1], [0.984313725490196, 0.18823529411764706, 0, 1], [0.984313725490196, 0.17254901960784313, 0, 1], [0.984313725490196, 0.1568627450980392, 0, 1], [0.984313725490196, 0.1411764705882353, 0, 1], [0.984313725490196, 0.12549019607843137, 0, 1], [0.984313725490196, 0.10980392156862745, 0, 1], [0.9803921568627451, 0.09411764705882353, 0, 1], [0.9803921568627451, 0.0784313725490196, 0, 1], [0.9803921568627451, 0.06274509803921569, 0, 1], [0.9803921568627451, 0.047058823529411764, 0, 1], [0.9803921568627451, 0.03137254901960784, 0, 1], [0.9803921568627451, 0.01568627450980392, 0, 1], [0.9803921568627451, 0, 0, 1], [0.9647058823529412, 0, 0, 1], [0.9490196078431372, 0, 0, 1], [0.9372549019607843, 0, 0, 1], [0.9215686274509803, 0, 0, 1], [0.9058823529411765, 0, 0, 1], [0.8901960784313725, 0, 0, 1], [0.8745098039215686, 0, 0, 1], [0.8627450980392157, 0, 0, 1], [0.8470588235294118, 0, 0, 1], [0.8313725490196079, 0, 0, 1], [0.8156862745098039, 0, 0, 1], [0.8, 0, 0, 1], [0.7843137254901961, 0, 0, 1], [0.7725490196078432, 0, 0, 1], [0.7568627450980392, 0, 0, 1], [0.7411764705882353, 0, 0, 1], [0.7254901960784313, 0, 0, 1], [0.7098039215686275, 0, 0, 1], [0.6980392156862745, 0, 0, 1], [0.6823529411764706, 0, 0, 1], [0.6666666666666666, 0, 0, 1], [0.6509803921568628, 0, 0, 1], [0.6352941176470588, 0, 0, 1], [0.6235294117647059, 0, 0, 1], [0.6078431372549019, 0, 0, 1], [0.592156862745098, 0, 0, 1], [0.5764705882352941, 0, 0, 1], [0.5607843137254902, 0, 0, 1], [0.5450980392156862, 0, 0, 1], [0.5333333333333333, 0, 0, 1], [0.5176470588235295, 0, 0, 1], [0.5019607843137255, 0, 0, 1]];

            _export('WaveCtrl', WaveCtrl = function (_MetricsPanelCtrl) {
                _inherits(WaveCtrl, _MetricsPanelCtrl);

                function WaveCtrl($scope, $injector, $rootScope, templateSrv) {
                    _classCallCheck(this, WaveCtrl);

                    var _this = _possibleConstructorReturn(this, (WaveCtrl.__proto__ || Object.getPrototypeOf(WaveCtrl)).call(this, $scope, $injector));

                    _this.$rootScope = $rootScope;
                    _this.templateSrv = templateSrv;
                    _.defaults(_this.panel, panelDefaults);
                    _this.panel.options = [{
                        "name": "显示",
                        value: true
                    }, {
                        "name": "隐藏",
                        value: false
                    }];

                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    return _this;
                }

                _createClass(WaveCtrl, [{
                    key: 'accMul',
                    value: function accMul(arg1, arg2) {
                        var m = 0,
                            s1 = arg1.toString(),
                            s2 = arg2.toString();
                        try {
                            m += s1.split(".")[1].length;
                        } catch (e) {}
                        try {
                            m += s2.split(".")[1].length;
                        } catch (e) {}
                        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
                    }
                }, {
                    key: 'setSfCoefficient',
                    value: function setSfCoefficient() {
                        if (this.panel.tabIndex === 'SF' && this.panel.sfCoefficient !== this.panel.sfTempCoefficient) {
                            this.panel.sfTempCoefficient = this.panel.sfCoefficient;
                            this.render();
                        }
                    }
                }, {
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.addEditorTab('Options', 'public/plugins/oge-sonarwave/editor.html', 2);
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {

                        if (dataList == null || dataList.length == 0) {
                            console.error("no data found wave");
                            return;
                        }

                        if (this.panel.targets.length > 0 && JSON.stringify(this.panel.targets[0]) != "{}") {
                            for (var item in this.panel.tabOptions) {
                                this.panel.tabOptions[item].variable.options = [];
                                for (var _i = 0; _i < this.panel.targets.length; _i++) {
                                    var tar = this.panel.targets[_i];
                                    var varOption = this.panel.tabOptions[item].variable.options[_i];
                                    var selectedBool = varOption && varOption.selected;
                                    this.panel.tabOptions[item].variable.options.push({
                                        "text": tar.target.indexOf('_') > 0 ? tar.target.split('_')[1] : tar.target,
                                        "value": tar.refId,
                                        "selected": selectedBool ? varOption.selected : false
                                    });
                                }
                            }
                        }

                        var time = dataList[0].datapoints && dataList[0].datapoints[0] && dataList[0].datapoints[0][1] ? dataList[0].datapoints[0][1] : dataList[0];
                        var sType = typeof time === 'undefined' ? 'undefined' : _typeof(time);
                        if (sType != "string") {
                            console.error("不匹配的数据类型，请检查数据源是否正确");
                            return;
                        }

                        this.panel.times = time;
                        var timeList = [];
                        for (var i = 0; i < dataList.length; i++) {
                            timeList.push({
                                value: i,
                                time: dataList[i].datapoints && dataList[i].datapoints[0] && dataList[i].datapoints[0][1] ? dataList[i].datapoints[0][1] : dataList[i]
                            });
                        }
                        this.panel.timeIndex = timeList.length - 1; //显示最后一条（最新一条）
                        this.panel.timeList = timeList;
                        this.render();
                    }
                }, {
                    key: 'onRender',
                    value: function onRender() {}
                }, {
                    key: 'changeViewType',
                    value: function changeViewType() {
                        //改变同轴分轴调用
                        this.render();
                    }
                }, {
                    key: 'changeWaveTab',
                    value: function changeWaveTab(index) {
                        this.panel.tabIndex = index;
                        this.render();
                    }
                }, {
                    key: 'changeStart',
                    value: function changeStart(kksStart) {
                        var jz = this.templateSrv.replace("$jz");
                        if (jz === "$jz") {
                            return kksStart;
                        }
                        var dc = this.templateSrv.replace("$dc");
                        if (dc !== "$dc") {
                            kksStart = dc + kksStart.substring(5); //替换电厂5位
                        }
                        if (kksStart.length === 8) {
                            return kksStart.substring(0, 6) + jz; //替换机组2位
                        }
                        return kksStart.substring(0, 6) + jz + kksStart.substring(8); //替换机组2位
                    }
                }, {
                    key: 'playAudio',
                    value: function playAudio() {
                        if (wavesurfers.length > 0) {
                            for (var i = 0; i < wavesurfers.length; i++) {
                                wavesurfers[i].playPause();
                            }
                        }
                    }
                }, {
                    key: 'getWaveDataByTime',
                    value: function getWaveDataByTime(inputTime, kksInfo) {
                        var _this3 = this;

                        if (this.datasource == undefined) return;

                        kksInfo.kksCode = this.changeStart(kksInfo.kksCode);

                        var formData = new FormData();
                        formData.append("kksCode", kksInfo.kksCode);
                        formData.append("sonarTime", inputTime);
                        if (this.datasource.type === 'oge-wave') {
                            formData.append("kdmUrl", this.datasource.kdmUrl);
                        }
                        var options = {
                            method: 'POST',
                            data: formData,
                            url: this.datasource.url + '/wave/getWavesSonar'
                        };
                        var _this2 = this;
                        var promise = new Promise(function (resolve, reject) {

                            _this3.datasource.request(options).then(function (body) {
                                var tempData = null;
                                if (typeof body.data === 'string') {
                                    if (body.data.length < 20) {
                                        reject('声纳波形模型计算异常');
                                        return;
                                    }
                                    tempData = JSON.parse(body.data);
                                } else {
                                    tempData = body.data;
                                }
                                tempData.kksInfo = kksInfo;
                                if (_this2.panel.times === null) {
                                    _this2.panel.times = inputTime;
                                } else {
                                    _this2.panel.times = _this2.panel.times + ',' + inputTime;
                                }
                                resolve(tempData);
                            }, function (error) {
                                reject(error);
                            });
                        });
                        return promise;
                    }
                }, {
                    key: 'queryChangedText',
                    value: function queryChangedText(tabOption) {
                        tabOption.variable.options = tabOption.variable.options.filter(function (item) {
                            return item.text.indexOf(query) > 0;
                        });
                    }
                }, {
                    key: 'getSelectValue',
                    value: function getSelectValue(tabOption) {
                        var selectTargets = [];
                        var selectedArr = tabOption.variable.current.value;
                        for (var i = 0; i < selectedArr.length; i++) {
                            for (var j = 0; j < this.panel.targets.length; j++) {
                                if (this.panel.targets[j].refId === selectedArr[i]) {
                                    var tar = this.panel.targets[j];
                                    tar.datalistInd = j;
                                    selectTargets[i] = tar;
                                }
                            }
                        }
                        tabOption.selectTargets = selectTargets;
                        this.setSelectInfo(tabOption);
                    }
                }, {
                    key: 'setSelectInfo',
                    value: function setSelectInfo(tabOption) {
                        //改变select input中的内容
                        if (tabOption.selectTargets.length === 0) {
                            tabOption.tempInfo = "请选择数据";
                            return;
                        }
                        tabOption.tempInfo = tabOption.variable.current.text;
                        if (tabOption.value == this.panel.tabIndex) {
                            this.render();
                        }
                    }
                }, {
                    key: 'show',
                    value: function show(variableObj) {
                        variableObj.oldVariableText = variableObj.variable.current.text;

                        variableObj.selectedValues = _.filter(variableObj.variable.options, { selected: true });

                        variableObj.query = '';

                        variableObj.dropdownVisible = true;
                        currentDropdown = variableObj.value;
                        this.openDropdown(variableObj);
                    }
                }, {
                    key: 'openDropdown',
                    value: function openDropdown(variableObj) {
                        var that = this;
                        $(".multi-input-selectorclass-" + variableObj.ind).css('width', Math.max($(".multi-alink-selectorclass-" + variableObj.ind).width(), 80) + 'px');

                        $(".multi-input-selectorclass-" + variableObj.ind).show();
                        $(".multi-alink-selectorclass-" + variableObj.ind).hide();

                        $(".multi-input-selectorclass-" + variableObj.ind).focus();
                        if (domFunctionOnce) {
                            domFunctionOnce = false;
                            $(document).ready(function () {
                                $(document.body).click(function (e) {
                                    that.bodyOnClick(e);
                                });
                            });
                        }
                    }
                }, {
                    key: 'bodyOnClick',
                    value: function bodyOnClick(e) {
                        var _this4 = this;

                        if ($('.multi-selector-all').has(e.target).length === 0) {
                            this.$scope.$apply(function () {
                                _this4.commitChanges(_this4.panel.tabOptions[currentDropdown]);
                            });
                        }
                    }
                }, {
                    key: 'clearSelections',
                    value: function clearSelections(tabOption) {
                        _.each(tabOption.variable.options, function (option) {
                            option.selected = false;
                        });

                        this.selectionsChanged(tabOption);
                    }
                }, {
                    key: 'selectionsChanged',
                    value: function selectionsChanged(tabOption) {
                        tabOption.selectedValues = _.filter(tabOption.variable.options, { selected: true });
                        tabOption.variable.current.value = _.map(tabOption.selectedValues, 'value');
                        tabOption.variable.current.text = _.map(tabOption.selectedValues, 'text').join(' + ');
                    }
                }, {
                    key: 'switchToLink',
                    value: function switchToLink(tabOption) {
                        $(".multi-input-selectorclass-" + tabOption.ind).hide();
                        $(".multi-alink-selectorclass-" + tabOption.ind).show();
                    }
                }, {
                    key: 'commitChanges',
                    value: function commitChanges(tabOption) {
                        // if we have a search query and no options use that
                        if (tabOption.variable.options.length === 0 && tabOption.query.length > 0) {
                            tabOption.variable.current = { text: tabOption.query, value: tabOption.query };
                        } else if (tabOption.variable.options.length > 0 && tabOption.selectedValues.length === 0) {
                            // make sure one option is selected
                            tabOption.variable.options[0].selected = true;
                            this.selectionsChanged(tabOption);
                        }

                        tabOption.dropdownVisible = false;
                        this.switchToLink(tabOption);

                        if (tabOption.variable.current.text !== tabOption.oldVariableText) {
                            this.getSelectValue(tabOption);
                        }
                    }
                }, {
                    key: 'selectValue',
                    value: function selectValue(option, tabOption) {
                        if (!option) {
                            return;
                        }

                        option.selected = !option.selected;

                        this.selectionsChanged(tabOption);
                    }
                }, {
                    key: 'link',
                    value: function link(scope, elem, attrs, ctrl, templateSrv) {
                        var systemColor = ["#7eb26d", "#EE0000", "#0000EE", "#EEEE00", "#8DEEEE", "#1874CD", "#00EE00", "#008B8B"];

                        function getTempData(data, index, tabIndex, name) {
                            //频域波形
                            if (tabIndex == 'SF') {
                                var xAxis = {
                                    data: data.dataFreq,
                                    name: "时间",
                                    axisLabel: {
                                        show: false
                                    }
                                };
                                var yAxis = {
                                    min: "dataMin",
                                    axisLabel: {
                                        formatter: getFormatter(0, "")
                                    },
                                    splitLine: {
                                        lineStyle: {
                                            color: ['#444343']
                                        }
                                    }
                                };
                                if (index == ctrl.panel.tabOptions[tabIndex].selectedValues.length - 1) {
                                    xAxis.axisLabel.show = true;
                                    xAxis.axisLabel.formatter = getFormatter(2, 'f/khz');
                                }
                                var sfDataValue = null;
                                if (ctrl.panel.sfCoefficient === 1) {
                                    sfDataValue = data.dataValue;
                                } else {
                                    sfDataValue = data.dataValue.map(function (d) {
                                        return ctrl.accMul(d, ctrl.panel.sfCoefficient);
                                    });
                                }
                                var series = {
                                    name: name,
                                    type: 'bar',
                                    data: sfDataValue,
                                    showSymbol: false, //不显示与X轴对应的坐标
                                    symbol: "circle",
                                    barWidth: 1,
                                    barMaxWidth: 1,
                                    lineStyle: {
                                        normal: {
                                            width: 1
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color: systemColor[index]
                                        }
                                    }
                                };
                                return [xAxis, yAxis, series];
                            } else {
                                //时域和时频域波形,要自己去添加这44位byte数组头
                                var dataValue = data.dataValue;
                                //一秒数据是16000长度
                                var second = data.dataNum / 16000 * 64000;
                                var second36 = second + 36;
                                var dataLenBytes = getInt8Array(second36);
                                var riff = [82, 73, 70, 70];
                                for (var _i2 = 0; _i2 < dataLenBytes.length; _i2++) {
                                    riff.push(dataLenBytes[_i2]);
                                }
                                var headerArr = riff.concat([87, 65, 86, 69, 102, 109, 116, 32, 16, 0, 0, 0, 1, 0, 1, 0, -128, 62, 0, 0, 0, -6, 0, 0, 4, 0, 32, 0, 100, 97, 116, 97]);
                                var dataLastBytes = getInt8Array(second);
                                for (var _i3 = 0; _i3 < dataLastBytes.length; _i3++) {
                                    headerArr.push(dataLastBytes[_i3]);
                                }
                                var header32Arr = new Int32Array(new Int8Array(headerArr).buffer);
                                // 数据全部左移，使得小数点前有足够的整数部分, 然后取整
                                var buf = new Int32Array(dataValue.length);
                                for (var i = 0; i < dataValue.length; i++) {
                                    buf[i] = dataValue[i] * 5000000000;
                                }
                                var uintBuf = new Uint32Array(buf);
                                var int32Buf = new Int32Array(uintBuf);
                                var resultArr = new Int32Array(int32Buf.length + header32Arr.length);
                                resultArr.set(header32Arr, 0);
                                resultArr.set(int32Buf, header32Arr.length);
                                var dataSx = resultArr.buffer;
                                return dataSx;
                            }
                        }

                        function getInt8Array(num) {
                            var buffer = new ArrayBuffer(4);
                            var view = new DataView(buffer);
                            view.setUint32(0, num, true);
                            return new Int8Array(buffer);
                        }

                        function initGraph(xArr, yArr, sArr, kksNameArr, index, divArr) {
                            var myChart = echarts.init(divArr[index]);

                            var option = {
                                title: {
                                    text: '',
                                    show: false
                                },
                                grid: {
                                    left: 40,
                                    top: 5,
                                    bottom: 5,
                                    right: 8
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    showDelay: 0,
                                    axisPointer: {
                                        show: true,
                                        type: 'line',
                                        lineStyle: {
                                            type: 'dashed',
                                            width: 2
                                        }
                                    },
                                    zlevel: 1
                                },
                                legend: {
                                    data: kksNameArr,
                                    right: "0px",
                                    top: "0px",
                                    z: 3,
                                    orient: "horizontal",
                                    textStyle: {
                                        color: "white" //图例字体颜色
                                    }
                                },
                                textStyle: {
                                    color: "white"
                                }
                            };
                            option.xAxis = xArr;
                            option.yAxis = yArr;
                            option.series = sArr;
                            myChart.group = "index_" + index;

                            var dataZoom = [{
                                show: false,
                                handleSize: '80%',
                                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                                backgroundColor: 'transparent',
                                fillerColor: 'rgba(0,0,0,0.4)',
                                showDataShadow: false,
                                borderColor: 'transparent',
                                bottom: 30,
                                handleStyle: {
                                    color: 'rgba(255,255,255,0.7)',
                                    shadowBlur: 3,
                                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                                    shadowOffsetX: 2,
                                    shadowOffsetY: 2
                                }
                            }];

                            //最后一个图表，展示最下测的数据筛选功能
                            if (index == divArr.length - 1) {
                                dataZoom[0].show = true;
                                option.grid.bottom = 60;
                            }
                            option.dataZoom = dataZoom;

                            myChart.setOption(option);
                            return myChart;
                        }
                        //根据精度，单位； 返回echarts图表中的formatter对象
                        function getFormatter(num, unit) {
                            var formatter = function formatter(value, index) {
                                value = Number(value);
                                if (value == undefined) {
                                    return "";
                                }
                                if (value == 0 || value == parseInt(value)) {
                                    //如果数据本身就是一个正数，就不需要保留小数了
                                    return value;
                                }
                                if (unit == null) {
                                    unit = "";
                                }
                                if (num == 0) {
                                    return parseInt(value) + unit;
                                }
                                return value.toFixed(num) + unit;
                            };
                            return formatter;
                        }

                        ctrl.events.on('render', function () {
                            if (wavesurfers.length > 0) {
                                for (var i = 0; i < wavesurfers.length; i++) {
                                    wavesurfers[i] = null;
                                    // wavesurfers[i].empty();
                                    // wavesurfers[i].destroy();
                                }
                                wavesurfers = [];
                            }
                            var obj = elem.find('.data-panel');
                            obj.html('');
                            if (ctrl.panel.tabOptions[ctrl.panel.tabIndex].selectedValues.length == 0) {
                                obj.html('<span style="margin-top: 45px; display: inline-block;">\u65E0\u6709\u6548\u6570\u636E,\u8BF7\u786E\u8BA4\u7F16\u7801\u662F\u5426\u6B63\u786E\uFF01</span>');
                                return;
                            }
                            var allHeight = ctrl.height;
                            var marginTrue = false;
                            if (ctrl.panel.tabIsShow) {
                                allHeight = allHeight - 40; //顶部标签页 + 时间选择
                                marginTrue = true;
                            }
                            ctrl.panel.marginTrue = marginTrue; //是否距离上边距40的像素，否则遮住了下拉框，无法选择
                            ctrl.panel.times = null;
                            if (!ctrl.panel.showType || ctrl.panel.tabIndex === 'SW') {
                                showSplitCharts(obj, allHeight); //分轴显示
                            } else {
                                showCoaxialCharts(obj, allHeight); //同轴显示
                            }
                        });

                        async function showSplitCharts(obj, allHeight) {
                            if (ctrl.panel.tabIndex === 'SF') {
                                allHeight = allHeight - 50; // 最下面的图表（数据筛选条 + 坐标）共占据50像素高度
                            }
                            var divArr = [];
                            var charts = [];
                            var targets = ctrl.panel.tabOptions[ctrl.panel.tabIndex].selectTargets;

                            //过滤掉波形时刻为空的监测量
                            var codeTimes = [];

                            targets.forEach(function (value, index) {
                                if (value && value.target != "" && value.datalistInd >= 0 && ctrl.panel.timeList[value.datalistInd] && ctrl.panel.timeList[value.datalistInd].time && ctrl.panel.timeList[value.datalistInd].time != '') {

                                    codeTimes.push({
                                        time: ctrl.panel.timeList[value.datalistInd].time,
                                        tag: value
                                    });
                                }
                            });

                            if (codeTimes.length == 0) return;
                            var height = allHeight / codeTimes.length - 5;
                            if (ctrl.panel.tabIndex === 'SX' && codeTimes.length > 1) {
                                height = (allHeight - 40) / codeTimes.length;
                            }

                            var promises = [];
                            for (var i = 0; i < codeTimes.length; i++) {
                                var dataTime = codeTimes[i].time;
                                if (dataTime && dataTime != "") {
                                    if (i == codeTimes.length - 1 && ctrl.panel.tabIndex === 'SF') {
                                        height += 50; //最后一个图表的高度 = 平局高度 + 50;
                                    }
                                    if (ctrl.panel.tabIndex === 'ST') {
                                        //50个高度显示时间条
                                        height -= 50;
                                    }
                                    var div = $("<div id='mySW_" + i + "' class='myDiv_" + i + "' style='height:" + height + "px'></div>");
                                    divArr.push(div[0]);
                                    obj.append(div);
                                    var divT = $("<div id='myST_" + i + "' class='myDiv_" + i + "' style='height:50px;'></div>");
                                    obj.append(divT);
                                    if (ctrl.panel.tabIndex === 'SX') {
                                        divT[0].style.visibility = 'hidden';
                                        var div2 = $("<div id='mySW_0" + i + "' class='myDiv_0" + i + "' style='height:40px;visibility:hidden'></div>");
                                        obj.append(div2);
                                    }
                                    var array = codeTimes[i].tag.target.split("_"); //kks, name

                                    //异步请求数据返回的顺序可能不一致,所以在此处需要重新构建一个kksInfo对象
                                    var kksInfo = {
                                        kksCode: array[0],
                                        name: array[1]
                                    };
                                    var promise = await ctrl.getWaveDataByTime(dataTime, kksInfo);
                                    promises.push(promise);
                                }
                            }

                            Promise.all(promises).then(function (data) {

                                if (!_.isArray(data) || !data[0] || !_.isArray(data[0].chBlocks) || !data[0].chBlocks[0]) return;

                                var tabSelected = data.filter(function (val) {
                                    return ctrl.panel.tabIndex === 'SF' && val.chBlocks[0].dataType !== ctrl.panel.tabIndex || ctrl.panel.tabIndex !== 'SF' && val.chBlocks[0].dataType !== 'SW';
                                });
                                if (tabSelected.length > 0) {
                                    obj.html('<span>\u8BF7\u68C0\u67E5\u7F16\u7801\u662F\u5426\u9009\u62E9\u6B63\u786E\uFF01</span>');
                                    return;
                                }

                                data.forEach(function (item, index) {

                                    if (!item || item.chBlocks.length == 0) return;
                                    var kksNameArr = [];
                                    var xArr = [];
                                    var yArr = [];
                                    var sArr = [];
                                    var name = item.kksInfo.name ? item.kksInfo.name : item.chBlocks[0].chName;
                                    var temp = getTempData(item.chBlocks[0], index, ctrl.panel.tabIndex, name);
                                    kksNameArr.push(name);
                                    if (ctrl.panel.tabIndex == 'SF') {
                                        xArr.push(temp[0]);
                                        yArr.push(temp[1]);
                                        sArr.push(temp[2]);
                                        var chart = initGraph(xArr, yArr, sArr, kksNameArr, index, divArr);
                                        charts.push(chart);
                                    } else {
                                        var containerSTId = null;
                                        var containerSXId = '#mySW_00';
                                        var containerSTTimeId = '#myST_0';
                                        if (ctrl.panel.tabIndex === 'ST') {
                                            containerSTId = '#mySW_' + index;
                                            containerSTTimeId = '#myST_' + index;
                                        } else {
                                            containerSTId = '#mySW_0' + index;
                                            containerSXId = '#mySW_' + index;
                                        }
                                        var wsParams = {
                                            container: containerSTId, //容器
                                            closeAudioContext: true,
                                            waveColor: '#FF55C5',
                                            progressColor: '#00BFBF',
                                            split: false,
                                            minPxPerSec: 8,
                                            drawingContextAttributes: {
                                                desynchronized: false
                                            },
                                            height: height,
                                            barHeight: 0.7,
                                            splitChannels: false,
                                            audioRate: '1',
                                            plugins: [Timeline.create({
                                                container: containerSTTimeId,
                                                duration: (item.packEndTime - item.packStartTime) / 1000,
                                                primaryFontColor: '#FF55C5',
                                                secondaryFontColor: '#FF55C5'
                                            }), SpectrogramPlugin.create({
                                                container: containerSXId,
                                                labels: true,
                                                height: height,
                                                colorMap: colors,
                                                fftSamples: 1024,
                                                frequencyMax: 8000
                                            })]
                                        };
                                        var wavesurfer = WaveSurfer.create(wsParams);
                                        var audioDate = new Blob([temp]);
                                        wavesurfer.loadBlob(audioDate);
                                        wavesurfers.push(wavesurfer);
                                    }
                                });
                                echarts.connect(charts);
                            }).catch(function (error) {
                                return console.error;
                            });
                        }

                        async function showCoaxialCharts(obj, height) {

                            var div = $("<div class='myDiv' style='height:" + height + "px'></div>");
                            obj.append(div);
                            var myChart = echarts.init(div[0]);

                            var targets = ctrl.panel.tabOptions[ctrl.panel.tabIndex].selectTargets;

                            var kksNameArr = [];
                            var firstData;
                            var sArr = [];

                            var promises = [];
                            for (var i = 0; i < targets.length; i++) {

                                var dataTime = ctrl.panel.timeList[targets[i].datalistInd].time;
                                if (dataTime && dataTime != "") {

                                    var array = targets[i].target.split("_");
                                    var kksName = array.length == 2 ? array[1] : "未定义";
                                    kksNameArr.push(kksName);

                                    var kksInfo = {
                                        kksCode: array[0] ? array[0] : targets[i].target,
                                        name: kksName
                                    };
                                    var promise = await ctrl.getWaveDataByTime(dataTime, kksInfo);
                                    promises.push(promise);
                                }
                            }

                            Promise.all(promises).then(function (data) {

                                if (!_.isArray(data) || !data[0] || !_.isArray(data[0].chBlocks) || !data[0].chBlocks[0]) return;

                                var tabSelected = data.filter(function (val) {
                                    return val.chBlocks[0].dataType !== ctrl.panel.tabIndex;
                                });
                                if (tabSelected.length > 0) {
                                    obj.html('<span>\u8BF7\u68C0\u67E5\u7F16\u7801\u662F\u5426\u9009\u62E9\u6B63\u786E\uFF01</span>');
                                    return;
                                }
                                data.forEach(function (item, index) {
                                    if (index == 0) {
                                        firstData = item.chBlocks[0];
                                    }
                                    var sfDataValue = null;
                                    if (ctrl.panel.sfCoefficient === 1) {
                                        sfDataValue = item.chBlocks[0].dataValue;
                                    } else {
                                        sfDataValue = item.chBlocks[0].dataValue.map(function (d) {
                                            return ctrl.accMul(d, ctrl.panel.sfCoefficient);
                                        });
                                    }
                                    var series = {
                                        name: item.kksInfo.name ? item.kksInfo.name : item.chBlocks[0].chName,
                                        type: 'bar',
                                        data: sfDataValue,
                                        showSymbol: false, //不显示与X轴对应的坐标
                                        symbol: "circle",
                                        lineStyle: {
                                            normal: {
                                                width: 1
                                            }
                                        },
                                        barWidth: 1,
                                        barMaxWidth: 1,
                                        itemStyle: {
                                            normal: {
                                                color: systemColor[index]
                                            }
                                        }

                                    };
                                    sArr.push(series);
                                });

                                var eoption = {
                                    title: {
                                        text: ctrl.panel.tabOptions[ctrl.panel.tabIndex].name,
                                        show: false
                                    },
                                    grid: {
                                        left: 40,
                                        top: 5,
                                        bottom: 60,
                                        right: 8
                                    },
                                    tooltip: {
                                        trigger: 'axis',
                                        showDelay: 0,
                                        axisPointer: {
                                            show: true,
                                            type: 'line',
                                            lineStyle: {
                                                type: 'dashed',
                                                width: 2
                                            }
                                        },
                                        zlevel: 1
                                    },
                                    legend: {
                                        data: kksNameArr,
                                        right: "0px",
                                        top: "0px",
                                        z: 3,
                                        orient: "horizontal",
                                        textStyle: {
                                            color: "white" //图例字体颜色
                                        }
                                    },
                                    textStyle: {
                                        color: "white"
                                    },
                                    xAxis: {
                                        data: firstData.dataFreq,
                                        name: "时间",
                                        axisLabel: {
                                            show: true,
                                            formatter: getFormatter(2, 'f/khz')
                                        }
                                    },
                                    yAxis: {
                                        min: "dataMin",
                                        axisLabel: {
                                            formatter: getFormatter(0, '')
                                        },
                                        splitLine: {
                                            lineStyle: {
                                                color: ['#444343']
                                            }
                                        }
                                    },
                                    series: sArr
                                };
                                myChart.setOption(eoption);
                            }).catch(function (error) {
                                console.error(error);
                            });
                        }
                    }
                }]);

                return WaveCtrl;
            }(MetricsPanelCtrl));

            _export('WaveCtrl', WaveCtrl);

            WaveCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=wave_ctrl.js.map
