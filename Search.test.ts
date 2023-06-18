// @ts-ignore
import Trie, { type Node } from "./Search.ts";

describe("Trie", () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie();
  });

  test("search should return false for an empty trie", () => {
    expect(trie.has("apple")).toBe(false);
  });

  test("search should return true after adding a word", () => {
    trie.add("apple");
    expect(trie.has("apple")).toBe(true);
  });

  test("search should return false after removing a word", () => {
    trie.add("apple");
    expect(trie.has("apple")).toBe(true);
    trie.remove("apple");
    expect(trie.has("apple")).toBe(false);
  });

  test("search should return false for a non-existent word", () => {
    trie.add("apple");
    expect(trie.has("banana")).toBe(false);
    expect(trie.has("appl")).toBe(false);
  });
  test.each`
    methode
    ${"add"}
    ${"remove"}
    ${"has"}
  `(
    "should throw when not right value is passed to $methode",
    ({ methode }: { methode: "add" | "remove" | "has" }) => {
      // @ts-expect-error
      expect(() => trie[methode](null)).toThrowError();
      // @ts-expect-error
      expect(() => trie[methode](undefined)).toThrowError();
      // @ts-expect-error
      expect(() => trie[methode](123)).toThrowError();
      // @ts-expect-error
      expect(() => trie[methode]([])).toThrowError();
      // @ts-expect-error
      expect(() => trie[methode]({})).toThrowError();
      expect(() => trie[methode]("")).toThrowError();
    }
  );
  test("should not have any leaves without word ends", () => {
    trie.add("application");
    trie.add("apple")
    trie.add("appl")
    trie.remove("application");

    const leavesWithoutWordEnds: string[] = [];
    checkLeavesWithoutWordEnds(trie.getRoot, "");

    expect(leavesWithoutWordEnds).toHaveLength(0);

    function checkLeavesWithoutWordEnds(node: Node, prefix: string) {
      if (node.children) {
        for (const child of node.children.values()) {
          const currentWord = prefix + child.value;
          if (
            !child.isWordEnd &&
            (!child.children || child.children.size === 0)
          ) {
            leavesWithoutWordEnds.push(currentWord);
          } else {
            checkLeavesWithoutWordEnds(child, currentWord);
          }
        }
      }
    }
  });
});
