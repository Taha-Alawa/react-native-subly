import { Children, type ReactNode } from "react";
import { Text, type TextProps } from "react-native";
import { SAR_FONT_FAMILY, SAR_GLYPH } from "@/core/constants/currencies";

// Icon fonts ship a single weight — a bold request would make Android fall
// back to a system face that has no glyph at this code point.
const GLYPH_STYLE = { fontFamily: SAR_FONT_FAMILY, fontWeight: "normal" } as const;

const renderWithGlyph = (children: ReactNode) =>
  Children.map(children, (child) => {
    if (typeof child !== "string" || !child.includes(SAR_GLYPH)) return child;

    return child.split(SAR_GLYPH).flatMap((part, index) =>
      index === 0
        ? [part]
        : [
            <Text key={index} style={GLYPH_STYLE}>
              {SAR_GLYPH}
            </Text>,
            part,
          ],
    );
  });

/**
 * Drop-in `Text` for anything holding a formatted amount. Plain text passes
 * through untouched; the Saudi Riyal sign is re-rendered in its own font.
 */
const MoneyText = ({ children, ...props }: TextProps) => (
  <Text {...props}>{renderWithGlyph(children)}</Text>
);

export default MoneyText;
