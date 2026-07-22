import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import * as matchers from "jest-axe/matchers";

expect.extend(matchers);
