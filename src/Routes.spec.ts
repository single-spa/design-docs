import {
  resolveRouteStructure,
  Routes,
  RouteTree,
  RouteTreeItemType,
} from "./Routes";

interface RouteTestSet {
  input: Routes;
  output: RouteTree;
}

const flatData: RouteTestSet = {
  input: [
    { label: "First", path: "flat-first" },
    { label: "Second", path: "flat-second" },
  ],
  output: [
    { type: RouteTreeItemType.ROUTE, index: 0 },
    { type: RouteTreeItemType.ROUTE, index: 1 },
  ],
};

const singleFlatGroupData: RouteTestSet = {
  input: [
    { label: "First child", group: "Group", path: "g-c1" },
    { label: "Second child", group: "Group", path: "g-c2" },
  ],
  output: [
    {
      type: RouteTreeItemType.GROUP,
      label: "Group",
      children: [
        { type: RouteTreeItemType.ROUTE, index: 0 },
        { type: RouteTreeItemType.ROUTE, index: 1 },
      ],
    },
  ],
};

const twoLevelData: RouteTestSet = {
  input: [
    { label: "Intro", path: "intro" },
    { label: "Input Usage", group: "Inputs", path: "inputs-usage" },
    { label: "Push Button", group: "Inputs/Buttons", path: "push-button" },
    { label: "Reset Button", group: "Inputs/Buttons", path: "reset-button" },
  ],
  output: [
    { type: RouteTreeItemType.ROUTE, index: 0 },
    {
      type: RouteTreeItemType.GROUP,
      label: "Inputs",
      children: [
        { type: RouteTreeItemType.ROUTE, index: 1 },
        {
          type: RouteTreeItemType.GROUP,
          label: "Buttons",
          children: [
            { type: RouteTreeItemType.ROUTE, index: 2 },
            { type: RouteTreeItemType.ROUTE, index: 3 },
          ],
        },
      ],
    },
  ],
};

describe("resolveRouteStructure()", () => {
  describe("when given a flat list of routes", () => {
    it("should return a flat tree", () => {
      const tree = resolveRouteStructure(flatData.input);
      expect(tree).toEqual(flatData.output);
    });
  });

  describe("when given a single group with flat routes", () => {
    it("should return a single root group with children", () => {
      expect(resolveRouteStructure(singleFlatGroupData.input)).toEqual(
        singleFlatGroupData.output
      );
    });
  });

  describe("when given nested groups and root route", () => {
    it("should return appropriate structure", () => {
      const tree = resolveRouteStructure(twoLevelData.input);
      expect(tree).toEqual(twoLevelData.output);
    });
  });
});
