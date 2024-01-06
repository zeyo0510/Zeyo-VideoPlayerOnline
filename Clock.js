class Clock
{
  static init()
  {
    let a = {
      hourCycle : settings.timeFormatHour12 ? "h12" : "h23"
    , hour      : "2-digit"
    , minute    : "2-digit"
    };
    settings.timeFormatSecond && (a.second = "2-digit");
    Clock.ClockFormat = new Intl.DateTimeFormat("en-GB", a)
  }

  static toggleClockTime()
  {
    if (rtInfo.classList.contains("d-none"))
    {
      Clock.updateClockTime(),
      rtInfo.classList.remove("d-none"),
      Clock.clockTimer = setInterval(Clock.updateClockTime, 1000)
    } else {
      rtInfo.classList.add("d-none");
      clearInterval(Clock.clockTimer);
    }
  }

  static updateClockTime()
  {
    rtInfo.textContent = Clock.ClockFormat.format(new Date);
  }
}
//////////////////////////////////////////////////
globalThis.Clock = Clock;