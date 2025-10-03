import { Canvas, Flex, Text, ScrollView } from '@canvas-ui/react'
import './App.css'
import { OffscreenCanvas } from './components/OffscreenCanvas'
import { useEffect, useRef, useState } from 'react'
import type { Flex as FlexType } from '@canvas-ui/react'

function App() {
  console.log('[App] Rendering')
  const canvasRef = useRef<OffscreenCanvas>()
  const buttonRef = useRef<FlexType>()
  const scrollViewRef = useRef<any>()
  const regularScrollViewRef = useRef<any>()
  const [imageUrl, setImageUrl] = useState<string>()
  const [frameNumber, setFrameNumber] = useState(0)
  const scrollEventsRef = useRef<Array<{ timestamp: number, scrollTop: number }>>([])
  const recordingStartTime = useRef<number>(0)

  // Simulate clicking the button once per second
  useEffect(() => {
    const interval = setInterval(() => {
      if (buttonRef.current) {
        console.log('[Auto-Click] Simulating Canvas UI button click')
        const event = {
          bubbles: true,
          cancelable: true,
          clientX: 256,
          clientY: 400,
          button: 0,
        }
        buttonRef.current.onPointerUp?.(event as any)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Record scroll events from regular canvas
  useEffect(() => {
    // Delay to ensure ref is set after render
    const timer = setTimeout(() => {
      if (regularScrollViewRef.current) {
        console.log('[Scroll Recorder] Starting to record scroll events')
        recordingStartTime.current = performance.now()
        scrollEventsRef.current = []

        const handleScroll = () => {
          const scrollView = regularScrollViewRef.current
          if (!scrollView) return

          const event = {
            timestamp: performance.now() - recordingStartTime.current,
            scrollTop: scrollView.scrollTop
          }
          scrollEventsRef.current.push(event)
          console.log('[Scroll Recorder]', event)
        }

        regularScrollViewRef.current.addEventListener('scroll', handleScroll)
      } else {
        console.log('[Scroll Recorder] ERROR: regularScrollViewRef.current is not set!')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Expose capture function to window for easy access
  useEffect(() => {
    (window as any).captureScrollEvents = () => {
      const events = scrollEventsRef.current

      // Download as file (no downsampling)
      const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'scroll-events.json'
      a.click()
      URL.revokeObjectURL(url)

      console.log(`[Scroll Capture] Downloaded ${events.length} events`)
      return events
    }
  }, [])

  // Playback recorded scroll events - DISABLED
  useEffect(() => {
    return // DISABLED
    const recordedEvents = [
  {
    "timestamp": 497.69999998807907,
    "scrollTop": 1
  },
  {
    "timestamp": 511.09999999403954,
    "scrollTop": 2
  },
  {
    "timestamp": 519.8000000119209,
    "scrollTop": 8
  },
  {
    "timestamp": 528.3000000119209,
    "scrollTop": 10
  },
  {
    "timestamp": 536.5,
    "scrollTop": 17
  },
  {
    "timestamp": 553.1999999880791,
    "scrollTop": 22
  },
  {
    "timestamp": 561.5,
    "scrollTop": 35
  },
  {
    "timestamp": 569.9000000059605,
    "scrollTop": 45
  },
  {
    "timestamp": 578.3000000119209,
    "scrollTop": 49
  },
  {
    "timestamp": 586.5999999940395,
    "scrollTop": 52
  },
  {
    "timestamp": 594.1999999880791,
    "scrollTop": 76
  },
  {
    "timestamp": 603.1999999880791,
    "scrollTop": 105
  },
  {
    "timestamp": 611.5,
    "scrollTop": 136
  },
  {
    "timestamp": 619.8000000119209,
    "scrollTop": 169
  },
  {
    "timestamp": 628.0999999940395,
    "scrollTop": 204
  },
  {
    "timestamp": 636.4000000059605,
    "scrollTop": 237
  },
  {
    "timestamp": 644.8000000119209,
    "scrollTop": 275
  },
  {
    "timestamp": 653.1999999880791,
    "scrollTop": 314
  },
  {
    "timestamp": 661.5,
    "scrollTop": 350
  },
  {
    "timestamp": 669.8000000119209,
    "scrollTop": 386
  },
  {
    "timestamp": 678.0999999940395,
    "scrollTop": 420
  },
  {
    "timestamp": 686.5999999940395,
    "scrollTop": 453
  },
  {
    "timestamp": 703.1999999880791,
    "scrollTop": 484
  },
  {
    "timestamp": 711.5,
    "scrollTop": 512
  },
  {
    "timestamp": 719.9000000059605,
    "scrollTop": 540
  },
  {
    "timestamp": 728.0999999940395,
    "scrollTop": 568
  },
  {
    "timestamp": 736.5,
    "scrollTop": 594
  },
  {
    "timestamp": 744.8000000119209,
    "scrollTop": 619
  },
  {
    "timestamp": 761.4000000059605,
    "scrollTop": 642
  },
  {
    "timestamp": 769.6999999880791,
    "scrollTop": 664
  },
  {
    "timestamp": 778.0999999940395,
    "scrollTop": 685
  },
  {
    "timestamp": 786.4000000059605,
    "scrollTop": 705
  },
  {
    "timestamp": 794.6999999880791,
    "scrollTop": 725
  },
  {
    "timestamp": 803.1999999880791,
    "scrollTop": 743
  },
  {
    "timestamp": 811.4000000059605,
    "scrollTop": 760
  },
  {
    "timestamp": 819.6999999880791,
    "scrollTop": 777
  },
  {
    "timestamp": 828.0999999940395,
    "scrollTop": 794
  },
  {
    "timestamp": 836.4000000059605,
    "scrollTop": 809
  },
  {
    "timestamp": 844.6999999880791,
    "scrollTop": 824
  },
  {
    "timestamp": 853.1999999880791,
    "scrollTop": 838
  },
  {
    "timestamp": 861.5,
    "scrollTop": 851
  },
  {
    "timestamp": 869.8000000119209,
    "scrollTop": 864
  },
  {
    "timestamp": 878.0999999940395,
    "scrollTop": 876
  },
  {
    "timestamp": 886.4000000059605,
    "scrollTop": 887
  },
  {
    "timestamp": 894.6999999880791,
    "scrollTop": 898
  },
  {
    "timestamp": 903.0999999940395,
    "scrollTop": 908
  },
  {
    "timestamp": 911.4000000059605,
    "scrollTop": 918
  },
  {
    "timestamp": 919.8000000119209,
    "scrollTop": 928
  },
  {
    "timestamp": 928.0999999940395,
    "scrollTop": 937
  },
  {
    "timestamp": 936.4000000059605,
    "scrollTop": 946
  },
  {
    "timestamp": 944.8000000119209,
    "scrollTop": 954
  },
  {
    "timestamp": 1028.0999999940395,
    "scrollTop": 956
  },
  {
    "timestamp": 1036.5,
    "scrollTop": 957
  },
  {
    "timestamp": 1044.800000011921,
    "scrollTop": 959
  },
  {
    "timestamp": 1061.5,
    "scrollTop": 961
  },
  {
    "timestamp": 1078.199999988079,
    "scrollTop": 962
  },
  {
    "timestamp": 1086.5,
    "scrollTop": 966
  },
  {
    "timestamp": 1094.800000011921,
    "scrollTop": 970
  },
  {
    "timestamp": 1103.0999999940395,
    "scrollTop": 975
  },
  {
    "timestamp": 1111.5,
    "scrollTop": 984
  },
  {
    "timestamp": 1119.800000011921,
    "scrollTop": 993
  },
  {
    "timestamp": 1128.0999999940395,
    "scrollTop": 1012
  },
  {
    "timestamp": 1136.5,
    "scrollTop": 1034
  },
  {
    "timestamp": 1144.699999988079,
    "scrollTop": 1059
  },
  {
    "timestamp": 1153.199999988079,
    "scrollTop": 1084
  },
  {
    "timestamp": 1160.699999988079,
    "scrollTop": 1110
  },
  {
    "timestamp": 1169.9000000059605,
    "scrollTop": 1137
  },
  {
    "timestamp": 1178.0999999940395,
    "scrollTop": 1167
  },
  {
    "timestamp": 1186.5,
    "scrollTop": 1196
  },
  {
    "timestamp": 1194.699999988079,
    "scrollTop": 1224
  },
  {
    "timestamp": 1203.199999988079,
    "scrollTop": 1252
  },
  {
    "timestamp": 1211.5,
    "scrollTop": 1278
  },
  {
    "timestamp": 1219.9000000059605,
    "scrollTop": 1303
  },
  {
    "timestamp": 1228.0999999940395,
    "scrollTop": 1326
  },
  {
    "timestamp": 1236.4000000059605,
    "scrollTop": 1349
  },
  {
    "timestamp": 1244.800000011921,
    "scrollTop": 1371
  },
  {
    "timestamp": 1253.0999999940395,
    "scrollTop": 1391
  },
  {
    "timestamp": 1261.5,
    "scrollTop": 1411
  },
  {
    "timestamp": 1269.800000011921,
    "scrollTop": 1431
  },
  {
    "timestamp": 1278.199999988079,
    "scrollTop": 1449
  },
  {
    "timestamp": 1286.4000000059605,
    "scrollTop": 1466
  },
  {
    "timestamp": 1294.800000011921,
    "scrollTop": 1483
  },
  {
    "timestamp": 1303.0999999940395,
    "scrollTop": 1498
  },
  {
    "timestamp": 1311.4000000059605,
    "scrollTop": 1513
  },
  {
    "timestamp": 1319.800000011921,
    "scrollTop": 1528
  },
  {
    "timestamp": 1327.9000000059605,
    "scrollTop": 1542
  },
  {
    "timestamp": 1336.5,
    "scrollTop": 1555
  },
  {
    "timestamp": 1344.699999988079,
    "scrollTop": 1568
  },
  {
    "timestamp": 1353.0999999940395,
    "scrollTop": 1580
  },
  {
    "timestamp": 1361.5,
    "scrollTop": 1592
  },
  {
    "timestamp": 1369.699999988079,
    "scrollTop": 1603
  },
  {
    "timestamp": 1378.0999999940395,
    "scrollTop": 1614
  },
  {
    "timestamp": 1386.4000000059605,
    "scrollTop": 1624
  },
  {
    "timestamp": 1394.9000000059605,
    "scrollTop": 1634
  },
  {
    "timestamp": 1403.0999999940395,
    "scrollTop": 1643
  },
  {
    "timestamp": 1411.5,
    "scrollTop": 1652
  },
  {
    "timestamp": 1419.800000011921,
    "scrollTop": 1661
  },
  {
    "timestamp": 1428.0999999940395,
    "scrollTop": 1669
  },
  {
    "timestamp": 1436.5,
    "scrollTop": 1676
  },
  {
    "timestamp": 1444.800000011921,
    "scrollTop": 1683
  },
  {
    "timestamp": 1453.0999999940395,
    "scrollTop": 1690
  },
  {
    "timestamp": 1460.9000000059605,
    "scrollTop": 1697
  },
  {
    "timestamp": 1469.800000011921,
    "scrollTop": 1704
  },
  {
    "timestamp": 1478.0999999940395,
    "scrollTop": 1711
  },
  {
    "timestamp": 1486.4000000059605,
    "scrollTop": 1717
  },
  {
    "timestamp": 1494.800000011921,
    "scrollTop": 1722
  },
  {
    "timestamp": 1503.199999988079,
    "scrollTop": 1727
  },
  {
    "timestamp": 1511.5,
    "scrollTop": 1732
  },
  {
    "timestamp": 1519.800000011921,
    "scrollTop": 1737
  },
  {
    "timestamp": 1528.199999988079,
    "scrollTop": 1742
  },
  {
    "timestamp": 1536.4000000059605,
    "scrollTop": 1747
  },
  {
    "timestamp": 1544.9000000059605,
    "scrollTop": 1751
  },
  {
    "timestamp": 1553.0999999940395,
    "scrollTop": 1755
  },
  {
    "timestamp": 1561.5,
    "scrollTop": 1759
  },
  {
    "timestamp": 1568.9000000059605,
    "scrollTop": 1763
  },
  {
    "timestamp": 1578.199999988079,
    "scrollTop": 1767
  },
  {
    "timestamp": 1585.5,
    "scrollTop": 1771
  },
  {
    "timestamp": 1594.9000000059605,
    "scrollTop": 1775
  },
  {
    "timestamp": 1603.0999999940395,
    "scrollTop": 1779
  },
  {
    "timestamp": 1669.9000000059605,
    "scrollTop": 1780
  },
  {
    "timestamp": 1678.199999988079,
    "scrollTop": 1781
  },
  {
    "timestamp": 1694.9000000059605,
    "scrollTop": 1788
  },
  {
    "timestamp": 1703.0999999940395,
    "scrollTop": 1793
  },
  {
    "timestamp": 1711.4000000059605,
    "scrollTop": 1798
  },
  {
    "timestamp": 1718.800000011921,
    "scrollTop": 1815
  },
  {
    "timestamp": 1727.199999988079,
    "scrollTop": 1827
  },
  {
    "timestamp": 1736.5999999940395,
    "scrollTop": 1836
  },
  {
    "timestamp": 1744.800000011921,
    "scrollTop": 1850
  },
  {
    "timestamp": 1752.4000000059605,
    "scrollTop": 1856
  },
  {
    "timestamp": 1761.5999999940395,
    "scrollTop": 1873
  },
  {
    "timestamp": 1769.9000000059605,
    "scrollTop": 1883
  },
  {
    "timestamp": 1778.0999999940395,
    "scrollTop": 1892
  },
  {
    "timestamp": 1786.5,
    "scrollTop": 1919
  },
  {
    "timestamp": 1794.9000000059605,
    "scrollTop": 1952
  },
  {
    "timestamp": 1803.199999988079,
    "scrollTop": 1988
  },
  {
    "timestamp": 1811.5,
    "scrollTop": 2027
  },
  {
    "timestamp": 1819.9000000059605,
    "scrollTop": 2066
  },
  {
    "timestamp": 1827.300000011921,
    "scrollTop": 2104
  },
  {
    "timestamp": 1836.5,
    "scrollTop": 2147
  },
  {
    "timestamp": 1844.800000011921,
    "scrollTop": 2191
  },
  {
    "timestamp": 1853.199999988079,
    "scrollTop": 2232
  },
  {
    "timestamp": 1861.4000000059605,
    "scrollTop": 2271
  },
  {
    "timestamp": 1869.800000011921,
    "scrollTop": 2310
  },
  {
    "timestamp": 1877.199999988079,
    "scrollTop": 2346
  },
  {
    "timestamp": 1886.5,
    "scrollTop": 2382
  },
  {
    "timestamp": 1894.800000011921,
    "scrollTop": 2416
  },
  {
    "timestamp": 1903.0999999940395,
    "scrollTop": 2449
  },
  {
    "timestamp": 1911.4000000059605,
    "scrollTop": 2480
  },
  {
    "timestamp": 1919.800000011921,
    "scrollTop": 2511
  },
  {
    "timestamp": 1928.199999988079,
    "scrollTop": 2541
  },
  {
    "timestamp": 1936.5,
    "scrollTop": 2569
  },
  {
    "timestamp": 1944.800000011921,
    "scrollTop": 2597
  },
  {
    "timestamp": 1952.300000011921,
    "scrollTop": 2623
  },
  {
    "timestamp": 1961.5999999940395,
    "scrollTop": 2648
  },
  {
    "timestamp": 1969.800000011921,
    "scrollTop": 2671
  },
  {
    "timestamp": 1978.199999988079,
    "scrollTop": 2694
  },
  {
    "timestamp": 1986.5,
    "scrollTop": 2716
  },
  {
    "timestamp": 1994.699999988079,
    "scrollTop": 2736
  },
  {
    "timestamp": 2002.300000011921,
    "scrollTop": 2756
  },
  {
    "timestamp": 2011.5,
    "scrollTop": 2776
  },
  {
    "timestamp": 2019.9000000059605,
    "scrollTop": 2794
  },
  {
    "timestamp": 2028.199999988079,
    "scrollTop": 2811
  },
  {
    "timestamp": 2036.5,
    "scrollTop": 2828
  },
  {
    "timestamp": 2044.800000011921,
    "scrollTop": 2843
  },
  {
    "timestamp": 2052.199999988079,
    "scrollTop": 2858
  },
  {
    "timestamp": 2061.5,
    "scrollTop": 2873
  },
  {
    "timestamp": 2069.800000011921,
    "scrollTop": 2887
  },
  {
    "timestamp": 2078.0999999940395,
    "scrollTop": 2900
  },
  {
    "timestamp": 2086.5,
    "scrollTop": 2913
  },
  {
    "timestamp": 2094.800000011921,
    "scrollTop": 2925
  },
  {
    "timestamp": 2103.0999999940395,
    "scrollTop": 2937
  },
  {
    "timestamp": 2110.5999999940395,
    "scrollTop": 2948
  },
  {
    "timestamp": 2119.199999988079,
    "scrollTop": 2959
  },
  {
    "timestamp": 2127.800000011921,
    "scrollTop": 2969
  },
  {
    "timestamp": 2136.5,
    "scrollTop": 2979
  },
  {
    "timestamp": 2143.9000000059605,
    "scrollTop": 2988
  },
  {
    "timestamp": 2153.300000011921,
    "scrollTop": 2997
  },
  {
    "timestamp": 2161.5,
    "scrollTop": 3006
  },
  {
    "timestamp": 2169.800000011921,
    "scrollTop": 3014
  },
  {
    "timestamp": 2178.199999988079,
    "scrollTop": 3021
  },
  {
    "timestamp": 2186.5,
    "scrollTop": 3028
  },
  {
    "timestamp": 2194.800000011921,
    "scrollTop": 3035
  },
  {
    "timestamp": 2202.199999988079,
    "scrollTop": 3042
  },
  {
    "timestamp": 2210.5999999940395,
    "scrollTop": 3049
  },
  {
    "timestamp": 2219.9000000059605,
    "scrollTop": 3056
  },
  {
    "timestamp": 2228.0999999940395,
    "scrollTop": 3062
  },
  {
    "timestamp": 2236.4000000059605,
    "scrollTop": 3067
  },
  {
    "timestamp": 2244.800000011921,
    "scrollTop": 3072
  },
  {
    "timestamp": 2336.5,
    "scrollTop": 3075
  },
  {
    "timestamp": 2344.800000011921,
    "scrollTop": 3079
  },
  {
    "timestamp": 2353.199999988079,
    "scrollTop": 3084
  },
  {
    "timestamp": 2361.4000000059605,
    "scrollTop": 3087
  },
  {
    "timestamp": 2368.9000000059605,
    "scrollTop": 3092
  },
  {
    "timestamp": 2377.199999988079,
    "scrollTop": 3101
  },
  {
    "timestamp": 2386.5999999940395,
    "scrollTop": 3112
  },
  {
    "timestamp": 2394.9000000059605,
    "scrollTop": 3121
  },
  {
    "timestamp": 2403.199999988079,
    "scrollTop": 3130
  },
  {
    "timestamp": 2411.5,
    "scrollTop": 3137
  },
  {
    "timestamp": 2418.9000000059605,
    "scrollTop": 3145
  },
  {
    "timestamp": 2427.4000000059605,
    "scrollTop": 3152
  },
  {
    "timestamp": 2435.5,
    "scrollTop": 3166
  },
  {
    "timestamp": 2444.9000000059605,
    "scrollTop": 3171
  },
  {
    "timestamp": 2453.0999999940395,
    "scrollTop": 3201
  },
  {
    "timestamp": 2461.5,
    "scrollTop": 3236
  },
  {
    "timestamp": 2469.5,
    "scrollTop": 3274
  },
  {
    "timestamp": 2478.300000011921,
    "scrollTop": 3314
  },
  {
    "timestamp": 2486.4000000059605,
    "scrollTop": 3354
  },
  {
    "timestamp": 2503.199999988079,
    "scrollTop": 3397
  },
  {
    "timestamp": 2511.5,
    "scrollTop": 3441
  },
  {
    "timestamp": 2519.800000011921,
    "scrollTop": 3483
  },
  {
    "timestamp": 2528.199999988079,
    "scrollTop": 3522
  },
  {
    "timestamp": 2536.5,
    "scrollTop": 3561
  },
  {
    "timestamp": 2544.800000011921,
    "scrollTop": 3597
  },
  {
    "timestamp": 2561.5,
    "scrollTop": 3631
  },
  {
    "timestamp": 2569.800000011921,
    "scrollTop": 3664
  },
  {
    "timestamp": 2578.0999999940395,
    "scrollTop": 3695
  },
  {
    "timestamp": 2586.4000000059605,
    "scrollTop": 3726
  },
  {
    "timestamp": 2594.800000011921,
    "scrollTop": 3756
  },
  {
    "timestamp": 2603.0999999940395,
    "scrollTop": 3784
  },
  {
    "timestamp": 2611.4000000059605,
    "scrollTop": 3812
  },
  {
    "timestamp": 2628.0999999940395,
    "scrollTop": 3837
  },
  {
    "timestamp": 2636.4000000059605,
    "scrollTop": 3860
  },
  {
    "timestamp": 2644.699999988079,
    "scrollTop": 3883
  },
  {
    "timestamp": 2653.199999988079,
    "scrollTop": 3905
  },
  {
    "timestamp": 2661.4000000059605,
    "scrollTop": 3925
  },
  {
    "timestamp": 2669.800000011921,
    "scrollTop": 3945
  },
  {
    "timestamp": 2678.0999999940395,
    "scrollTop": 3965
  },
  {
    "timestamp": 2694.699999988079,
    "scrollTop": 3982
  },
  {
    "timestamp": 2703.0999999940395,
    "scrollTop": 3999
  },
  {
    "timestamp": 2711.4000000059605,
    "scrollTop": 4014
  },
  {
    "timestamp": 2719.699999988079,
    "scrollTop": 4029
  },
  {
    "timestamp": 2728.0999999940395,
    "scrollTop": 4044
  },
  {
    "timestamp": 2736.5,
    "scrollTop": 4058
  },
  {
    "timestamp": 2744.5999999940395,
    "scrollTop": 4071
  },
  {
    "timestamp": 2761.4000000059605,
    "scrollTop": 4083
  },
  {
    "timestamp": 2769.800000011921,
    "scrollTop": 4095
  },
  {
    "timestamp": 2778.0999999940395,
    "scrollTop": 4106
  },
  {
    "timestamp": 2786.5,
    "scrollTop": 4117
  },
  {
    "timestamp": 2794.800000011921,
    "scrollTop": 4127
  },
  {
    "timestamp": 2802.199999988079,
    "scrollTop": 4137
  },
  {
    "timestamp": 2811.5999999940395,
    "scrollTop": 4146
  },
  {
    "timestamp": 2819.800000011921,
    "scrollTop": 4155
  },
  {
    "timestamp": 2869.800000011921,
    "scrollTop": 4154
  },
  {
    "timestamp": 2878.0999999940395,
    "scrollTop": 4151
  },
  {
    "timestamp": 2886.5,
    "scrollTop": 4148
  },
  {
    "timestamp": 2894.800000011921,
    "scrollTop": 4143
  },
  {
    "timestamp": 2903.0999999940395,
    "scrollTop": 4130
  },
  {
    "timestamp": 2911.4000000059605,
    "scrollTop": 4126
  },
  {
    "timestamp": 2919.800000011921,
    "scrollTop": 4123
  },
  {
    "timestamp": 2928.199999988079,
    "scrollTop": 4101
  },
  {
    "timestamp": 2936.4000000059605,
    "scrollTop": 4080
  },
  {
    "timestamp": 2944.800000011921,
    "scrollTop": 4049
  },
  {
    "timestamp": 2953.199999988079,
    "scrollTop": 3992
  },
  {
    "timestamp": 2961.5,
    "scrollTop": 3928
  },
  {
    "timestamp": 2969.800000011921,
    "scrollTop": 3859
  },
  {
    "timestamp": 2978.0999999940395,
    "scrollTop": 3792
  },
  {
    "timestamp": 2986.4000000059605,
    "scrollTop": 3723
  },
  {
    "timestamp": 2994.699999988079,
    "scrollTop": 3656
  },
  {
    "timestamp": 3003.0999999940395,
    "scrollTop": 3588
  },
  {
    "timestamp": 3011.5,
    "scrollTop": 3520
  },
  {
    "timestamp": 3019.800000011921,
    "scrollTop": 3456
  },
  {
    "timestamp": 3036.5,
    "scrollTop": 3394
  },
  {
    "timestamp": 3044.800000011921,
    "scrollTop": 3335
  },
  {
    "timestamp": 3053.0999999940395,
    "scrollTop": 3276
  },
  {
    "timestamp": 3061.4000000059605,
    "scrollTop": 3219
  },
  {
    "timestamp": 3069.800000011921,
    "scrollTop": 3164
  },
  {
    "timestamp": 3077.199999988079,
    "scrollTop": 3112
  },
  {
    "timestamp": 3086.5,
    "scrollTop": 3060
  },
  {
    "timestamp": 3103.0999999940395,
    "scrollTop": 3013
  },
  {
    "timestamp": 3111.4000000059605,
    "scrollTop": 2966
  },
  {
    "timestamp": 3119.5999999940395,
    "scrollTop": 2922
  },
  {
    "timestamp": 3128.0999999940395,
    "scrollTop": 2878
  },
  {
    "timestamp": 3136.5,
    "scrollTop": 2836
  },
  {
    "timestamp": 3144.9000000059605,
    "scrollTop": 2795
  },
  {
    "timestamp": 3153.199999988079,
    "scrollTop": 2756
  },
  {
    "timestamp": 3169.9000000059605,
    "scrollTop": 2720
  },
  {
    "timestamp": 3178.199999988079,
    "scrollTop": 2684
  },
  {
    "timestamp": 3186.5,
    "scrollTop": 2650
  },
  {
    "timestamp": 3194.800000011921,
    "scrollTop": 2617
  },
  {
    "timestamp": 3203.0999999940395,
    "scrollTop": 2586
  },
  {
    "timestamp": 3210.800000011921,
    "scrollTop": 2555
  },
  {
    "timestamp": 3219.9000000059605,
    "scrollTop": 2527
  },
  {
    "timestamp": 3228.0999999940395,
    "scrollTop": 2499
  },
  {
    "timestamp": 3236.4000000059605,
    "scrollTop": 2473
  },
  {
    "timestamp": 3244.800000011921,
    "scrollTop": 2448
  },
  {
    "timestamp": 3253.0999999940395,
    "scrollTop": 2423
  },
  {
    "timestamp": 3261.4000000059605,
    "scrollTop": 2400
  },
  {
    "timestamp": 3269.800000011921,
    "scrollTop": 2377
  },
  {
    "timestamp": 3278.0999999940395,
    "scrollTop": 2355
  },
  {
    "timestamp": 3294.9000000059605,
    "scrollTop": 2335
  },
  {
    "timestamp": 3303.0999999940395,
    "scrollTop": 2315
  },
  {
    "timestamp": 3310.5,
    "scrollTop": 2297
  },
  {
    "timestamp": 3319.800000011921,
    "scrollTop": 2280
  },
  {
    "timestamp": 3327.199999988079,
    "scrollTop": 2265
  },
  {
    "timestamp": 3336.5,
    "scrollTop": 2250
  },
  {
    "timestamp": 3344.800000011921,
    "scrollTop": 2235
  },
  {
    "timestamp": 3353.199999988079,
    "scrollTop": 2220
  },
  {
    "timestamp": 3361.5,
    "scrollTop": 2207
  },
  {
    "timestamp": 3368.800000011921,
    "scrollTop": 2194
  },
  {
    "timestamp": 3378.199999988079,
    "scrollTop": 2182
  },
  {
    "timestamp": 3386.5,
    "scrollTop": 2170
  },
  {
    "timestamp": 3394.800000011921,
    "scrollTop": 2159
  },
  {
    "timestamp": 3403.0999999940395,
    "scrollTop": 2148
  },
  {
    "timestamp": 3411.5999999940395,
    "scrollTop": 2138
  },
  {
    "timestamp": 3418.9000000059605,
    "scrollTop": 2128
  },
  {
    "timestamp": 3436.5999999940395,
    "scrollTop": 2119
  },
  {
    "timestamp": 3444.800000011921,
    "scrollTop": 2110
  },
  {
    "timestamp": 3461.300000011921,
    "scrollTop": 2102
  },
  {
    "timestamp": 3469.800000011921,
    "scrollTop": 2095
  },
  {
    "timestamp": 3528.300000011921,
    "scrollTop": 2093
  },
  {
    "timestamp": 3536.5,
    "scrollTop": 2092
  },
  {
    "timestamp": 3544.4000000059605,
    "scrollTop": 2089
  },
  {
    "timestamp": 3552.199999988079,
    "scrollTop": 2086
  },
  {
    "timestamp": 3561.5999999940395,
    "scrollTop": 2079
  },
  {
    "timestamp": 3569.800000011921,
    "scrollTop": 2068
  },
  {
    "timestamp": 3578.0999999940395,
    "scrollTop": 2057
  },
  {
    "timestamp": 3586.5,
    "scrollTop": 2034
  },
  {
    "timestamp": 3594.699999988079,
    "scrollTop": 2020
  },
  {
    "timestamp": 3603.199999988079,
    "scrollTop": 1994
  },
  {
    "timestamp": 3611.5,
    "scrollTop": 1958
  },
  {
    "timestamp": 3619.9000000059605,
    "scrollTop": 1940
  },
  {
    "timestamp": 3627.199999988079,
    "scrollTop": 1922
  },
  {
    "timestamp": 3636.5999999940395,
    "scrollTop": 1899
  },
  {
    "timestamp": 3644.800000011921,
    "scrollTop": 1894
  },
  {
    "timestamp": 3653.199999988079,
    "scrollTop": 1888
  },
  {
    "timestamp": 3661.5,
    "scrollTop": 1845
  },
  {
    "timestamp": 3669.800000011921,
    "scrollTop": 1795
  },
  {
    "timestamp": 3678.199999988079,
    "scrollTop": 1740
  },
  {
    "timestamp": 3685.5999999940395,
    "scrollTop": 1682
  },
  {
    "timestamp": 3694.9000000059605,
    "scrollTop": 1627
  },
  {
    "timestamp": 3710.5999999940395,
    "scrollTop": 1571
  },
  {
    "timestamp": 3719.9000000059605,
    "scrollTop": 1514
  },
  {
    "timestamp": 3728.0999999940395,
    "scrollTop": 1457
  },
  {
    "timestamp": 3736.4000000059605,
    "scrollTop": 1402
  },
  {
    "timestamp": 3743.9000000059605,
    "scrollTop": 1350
  },
  {
    "timestamp": 3753.300000011921,
    "scrollTop": 1300
  },
  {
    "timestamp": 3761.5,
    "scrollTop": 1250
  },
  {
    "timestamp": 3769.800000011921,
    "scrollTop": 1203
  },
  {
    "timestamp": 3778.0999999940395,
    "scrollTop": 1156
  },
  {
    "timestamp": 3786.5,
    "scrollTop": 1112
  },
  {
    "timestamp": 3794.699999988079,
    "scrollTop": 1068
  },
  {
    "timestamp": 3803.0999999940395,
    "scrollTop": 1026
  },
  {
    "timestamp": 3811.5,
    "scrollTop": 987
  },
  {
    "timestamp": 3819.9000000059605,
    "scrollTop": 948
  },
  {
    "timestamp": 3836.5,
    "scrollTop": 912
  },
  {
    "timestamp": 3844.800000011921,
    "scrollTop": 876
  },
  {
    "timestamp": 3853.0999999940395,
    "scrollTop": 842
  },
  {
    "timestamp": 3861.5,
    "scrollTop": 811
  },
  {
    "timestamp": 3869.800000011921,
    "scrollTop": 780
  },
  {
    "timestamp": 3878.0999999940395,
    "scrollTop": 750
  },
  {
    "timestamp": 3886.5,
    "scrollTop": 722
  },
  {
    "timestamp": 3894.800000011921,
    "scrollTop": 694
  },
  {
    "timestamp": 3911.5,
    "scrollTop": 669
  },
  {
    "timestamp": 3919.800000011921,
    "scrollTop": 644
  },
  {
    "timestamp": 3928.0999999940395,
    "scrollTop": 621
  },
  {
    "timestamp": 3936.4000000059605,
    "scrollTop": 598
  },
  {
    "timestamp": 3944.800000011921,
    "scrollTop": 578
  },
  {
    "timestamp": 3953.0999999940395,
    "scrollTop": 558
  },
  {
    "timestamp": 3961.5999999940395,
    "scrollTop": 538
  },
  {
    "timestamp": 3978.199999988079,
    "scrollTop": 521
  },
  {
    "timestamp": 3986.5,
    "scrollTop": 504
  },
  {
    "timestamp": 3994.800000011921,
    "scrollTop": 487
  },
  {
    "timestamp": 4003.0999999940395,
    "scrollTop": 472
  },
  {
    "timestamp": 4011.4000000059605,
    "scrollTop": 457
  },
  {
    "timestamp": 4019.800000011921,
    "scrollTop": 442
  },
  {
    "timestamp": 4028.199999988079,
    "scrollTop": 429
  },
  {
    "timestamp": 4036.4000000059605,
    "scrollTop": 416
  },
  {
    "timestamp": 4044.699999988079,
    "scrollTop": 404
  },
  {
    "timestamp": 4053.0999999940395,
    "scrollTop": 393
  },
  {
    "timestamp": 4061.4000000059605,
    "scrollTop": 382
  },
  {
    "timestamp": 4069.800000011921,
    "scrollTop": 372
  },
  {
    "timestamp": 4078.0999999940395,
    "scrollTop": 362
  },
  {
    "timestamp": 4086.5,
    "scrollTop": 352
  },
  {
    "timestamp": 4094.800000011921,
    "scrollTop": 343
  },
  {
    "timestamp": 4111.5,
    "scrollTop": 335
  },
  {
    "timestamp": 4119.800000011921,
    "scrollTop": 327
  },
  {
    "timestamp": 4128.0999999940395,
    "scrollTop": 319
  },
  {
    "timestamp": 4136.5,
    "scrollTop": 312
  },
  {
    "timestamp": 4144.800000011921,
    "scrollTop": 305
  },
  {
    "timestamp": 4153.0999999940395,
    "scrollTop": 298
  },
  {
    "timestamp": 4169.800000011921,
    "scrollTop": 291
  },
  {
    "timestamp": 4178.0999999940395,
    "scrollTop": 285
  },
  {
    "timestamp": 4186.5,
    "scrollTop": 279
  },
  {
    "timestamp": 4194.800000011921,
    "scrollTop": 274
  },
  {
    "timestamp": 4203.0999999940395,
    "scrollTop": 269
  },
  {
    "timestamp": 4211.5,
    "scrollTop": 264
  },
  {
    "timestamp": 4219.800000011921,
    "scrollTop": 259
  },
  {
    "timestamp": 4269.9000000059605,
    "scrollTop": 257
  },
  {
    "timestamp": 4286.4000000059605,
    "scrollTop": 255
  },
  {
    "timestamp": 4294.9000000059605,
    "scrollTop": 251
  },
  {
    "timestamp": 4311.4000000059605,
    "scrollTop": 244
  },
  {
    "timestamp": 4319.800000011921,
    "scrollTop": 237
  },
  {
    "timestamp": 4328.0999999940395,
    "scrollTop": 220
  },
  {
    "timestamp": 4336.4000000059605,
    "scrollTop": 201
  },
  {
    "timestamp": 4344.800000011921,
    "scrollTop": 177
  },
  {
    "timestamp": 4353.0999999940395,
    "scrollTop": 133
  },
  {
    "timestamp": 4361.5,
    "scrollTop": 114
  },
  {
    "timestamp": 4369.800000011921,
    "scrollTop": 81
  },
  {
    "timestamp": 4378.199999988079,
    "scrollTop": 59
  },
  {
    "timestamp": 4386.4000000059605,
    "scrollTop": 18
  },
  {
    "timestamp": 4394.800000011921,
    "scrollTop": 0
  }
]

    const playback = (targetScrollView: any) => {
      if (!targetScrollView) return

      const startTime = performance.now()
      const playbackSpeed = 0.5 // 0.5 = half speed, 2.0 = double speed

      let eventIndex = 0

      const scheduleNext = () => {
        if (eventIndex >= recordedEvents.length) {
          // Loop: restart after 1 second
          console.log('[Playback] Restarting after', eventIndex, 'events')
          setTimeout(() => playback(targetScrollView), 1000)
          return
        }

        const event = recordedEvents[eventIndex]
        const nextTime = event.timestamp * playbackSpeed
        const delay = nextTime - (performance.now() - startTime)

        setTimeout(() => {
          targetScrollView.scrollTop = event.scrollTop
          eventIndex++
          scheduleNext()
        }, Math.max(0, delay))
      }

      scheduleNext()
    }

    // Start playback on OffscreenCanvas only after 1 second
    setTimeout(() => {
      playback(scrollViewRef.current)
    }, 1000)
  }, [])

  return (
    <div className="app-container">
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {/* OffscreenCanvas Test - LEFT */}
        <div style={{ flex: 1, padding: '20px', backgroundColor: 'white', borderRadius: '10px' }}>
        <h3>Canvas UI + OffscreenCanvas Component</h3>

        {/* Headless rendering - no DOM elements */}
        <OffscreenCanvas
          width={512}
          height={512}
          canvasRef={canvasRef}
          onFrameRendered={async ({ canvas, frameNumber, timestamp }) => {
            console.log(`[App] Frame ${frameNumber} rendered at ${timestamp.toFixed(2)}ms`)
            const blob = await canvas.convertToBlob()
            const url = URL.createObjectURL(blob)
            if (imageUrl) {
              URL.revokeObjectURL(imageUrl)
            }
            setImageUrl(url)
            setFrameNumber(frameNumber)
          }}
        >
          <Flex
            style={{
              width: 512,
              height: 512,
              flexDirection: 'column',
              backgroundColor: '#16a085',
            }}
          >
            {/* Header */}
            <Flex
              style={{
                width: 512,
                height: 80,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#138d75',
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}
              >
                OffscreenCanvas
              </Text>
            </Flex>

            {/* Scrollable content */}
            <ScrollView
              ref={scrollViewRef}
              style={{
                width: 110,
                height: 432,
              }}
            >
              <Flex
                style={{
                  width: 110,
                  flexDirection: 'column',
                  padding: 10,
                }}
              >
                {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
                  <Flex
                    key={num}
                    style={{
                      width: 90,
                      height: 90,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#e74c3c',
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 32,
                        fontWeight: 'bold',
                        color: '#ffffff',
                      }}
                    >
                      {num}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </ScrollView>
          </Flex>
        </OffscreenCanvas>

        {imageUrl ? (
          <>
            <p style={{ color: 'green' }}>✓ Rendered to OffscreenCanvas! Frame: {frameNumber}</p>
            <img src={imageUrl} alt="Canvas UI OffscreenCanvas" style={{ border: '2px solid black', maxWidth: '100%' }} />
          </>
        ) : (
          <p>Rendering...</p>
        )}
        </div>

        {/* Regular Canvas Test - RIGHT */}
        <div style={{ flex: 1, padding: '20px', backgroundColor: 'white', borderRadius: '10px' }}>
          <h3>Regular Canvas (for comparison)</h3>
          <div style={{ width: '512px', height: '512px' }}>
            <Canvas>
              <Flex
                style={{
                  width: 512,
                  height: 512,
                  flexDirection: 'column',
                  backgroundColor: '#3498db',
                }}
              >
                {/* Header */}
                <Flex
                  style={{
                    width: 512,
                    height: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#2980b9',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: 'bold',
                      color: '#ffffff',
                    }}
                  >
                    Regular Canvas
                  </Text>
                </Flex>

                {/* Scrollable content */}
                <ScrollView
                  ref={regularScrollViewRef}
                  style={{
                    width: 110,
                    height: 432,
                  }}
                >
                  <Flex
                    style={{
                      width: 110,
                      flexDirection: 'column',
                      padding: 10,
                    }}
                  >
                    {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
                      <Flex
                        key={num}
                        style={{
                          width: 90,
                          height: 90,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#f39c12',
                          borderRadius: 10,
                          marginBottom: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 32,
                            fontWeight: 'bold',
                            color: '#ffffff',
                          }}
                        >
                          {num}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </ScrollView>
              </Flex>
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
