import * as React from "react"
import Svg, { Ellipse, Defs, LinearGradient, Stop } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

const Flower: React.FC<SvgProps> = (props) => (
    <Svg
        width={57}
        height={37}
        viewBox="0 0 57 37"
        fill="none"
        {...props}
    >
        <Ellipse cx={20} cy={9} fill="url(#a)" rx={11} ry={9} />
        <Ellipse cx={39} cy={9} fill="url(#b)" rx={11} ry={9} />
        <Ellipse cx={29} cy={15} fill="url(#c)" rx={10} ry={6} />
        <Ellipse cx={11} cy={18} fill="url(#d)" rx={11} ry={9} />
        <Ellipse cx={46} cy={21} fill="url(#e)" rx={11} ry={9} />
        <Ellipse cx={29} cy={27} fill="url(#f)" rx={13} ry={10} />
        <Defs>
            <LinearGradient
                id="a"
                x1={20}
                x2={20}
                y1={0}
                y2={18}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#F1A5C2" />
                <Stop offset={1} stopColor="#8B5F70" />
            </LinearGradient>
            <LinearGradient
                id="b"
                x1={39}
                x2={39}
                y1={0}
                y2={18}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#F1A5C2" />
                <Stop offset={1} stopColor="#8B5F70" />
            </LinearGradient>
            <LinearGradient
                id="c"
                x1={29}
                x2={29}
                y1={9}
                y2={21}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FFC547" />
                <Stop offset={1} stopColor="#F4A261" />
            </LinearGradient>
            <LinearGradient
                id="d"
                x1={11}
                x2={11}
                y1={9}
                y2={27}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#F1A5C2" />
                <Stop offset={1} stopColor="#fff" />
            </LinearGradient>
            <LinearGradient
                id="e"
                x1={46}
                x2={46}
                y1={12}
                y2={30}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#F1A5C2" />
                <Stop offset={1} stopColor="#fff" />
            </LinearGradient>
            <LinearGradient
                id="f"
                x1={29}
                x2={29}
                y1={17}
                y2={37}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#F1A5C2" />
                <Stop offset={1} stopColor="#fff" />
            </LinearGradient>
        </Defs>
    </Svg>
)
export default Flower
