import * as React from "react"
import Svg, { Path } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

const Shelf: React.FC<SvgProps> = (props) => (
    <Svg
        width={276}
        height={31}
        viewBox="0 0 276 31"
        fill="none"
        {...props}
    >
        <Path
            d="M249.962 26C249.962 28.7614 247.723 31 244.962 31H236.364C233.603 31 231.364 28.7614 231.364 26V17H42.4043V26C42.4043 28.7614 40.1657 31 37.4043 31H28.8057C26.0444 30.9999 23.8057 28.7613 23.8057 26V17H5C2.23858 17 1.12748e-07 14.7614 0 12V5C0 2.23858 2.23858 0 5 0H271C273.761 0 276 2.23858 276 5V12C276 14.7614 273.761 17 271 17H249.962V26Z"
            fill={props.color || "#7D4533"}
        />
    </Svg>
)

export default Shelf
