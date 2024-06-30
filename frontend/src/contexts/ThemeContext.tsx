import { createContext } from "react";
import { ThemeContextInterface } from "../lib/types"

export const ThemeContext = createContext<ThemeContextInterface | null>(null);
