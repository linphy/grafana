## Clock Panel Plugin for Grafana

The Clock Panel can show the current time or a countdown and updates every second.

Show the time in another office or show a countdown to an important event.

### Options

- **Mode**:

  Default is time. If countdown is chosen then set the Countdown Deadline to start the countdown.

- **12 or 24 hour**:

  Show time in the 12/24 hour format.

- **Offset from UTC**:

  This is a simple way to get the time for different time zones. Default is empty and that means local time (whatever that is on your computer). -5 would be UTC -5 (New York or central US)

- **Countdown Deadline**:

  Used in conjuction with the mode being set to countdown. Choose a date and time to count down to.

- **Countdown End Text**:

  The text to show when the countdown ends. E.g. LIFTOFF

- **Date/Time formatting options**:

  The font size, weight and date/time formatting can be customized here. If the seconds ticking annoys you then change the time format to HH:mm for the 24 hour clock or h:mm A for the 12 hour clock.

- **Bg Color**:

  Choose a background color for the clock with the color picker.

### Screenshots

- [Screenshot of two clocks and a countdown](https://raw.githubusercontent.com/grafana/clock-panel/06ecf59c191db642127c6153bc3145e93a1df1f8/src/img/screenshot-clocks.png)
- [Screenshot of the options screen](https://raw.githubusercontent.com/grafana/clock-panel/06ecf59c191db642127c6153bc3145e93a1df1f8/src/img/screenshot-clock-options.png)

#### Changelog

##### v0.0.8

- Remove extraneous comma when 1 second left in the countdown. PR from @linkslice

##### v0.0.9

- Fixes bug with default properties not getting deep cloned [#20](https://github.com/grafana/clock-panel/issues/20)

##### v0.1.0

- 1.数据的值过大时，可以选择加单位，并且配置精度。2.支持ES数据源，可以在点击跳转时，链接带index参数。3.字体大小不仅要自适应模块大小，还可调节大小。4.将选择颜色的值表示出来。