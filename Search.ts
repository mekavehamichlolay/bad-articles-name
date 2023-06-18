export class Node {
  value: string;
  children: Map<string, Node> | undefined;
  isWordEnd: true | undefined;
  constructor(char: string) {
    this.value = char;
    this.children = undefined;
    this.isWordEnd = undefined;
  }
}
export default class SearchTree {
  private root: Node;
  constructor() {
    this.root = new Node("");
  }
  get getRoot() {
    return this.root;
  }
  add(word: string): void {
    if (typeof word !== "string" || word === "")
      throw new Error("the word must be length of at least one character");
    this.addChildren(word, this.root);
  }
  remove(word: string): void {
    if (typeof word !== "string" || word === "")
      throw new Error("the word must be length of at least one character");
    this.removeChildren(word, this.root);
  }
  has(word: string): boolean {
    if (typeof word !== "string" || word === "")
      throw new Error("the word must be length of at least one character");
    return this.search(word, this.root);
  }
  private addChildren(word: string, node: Node) {
    if (!node.children) {
      node.children = new Map<string, Node>();
    }
    const child =
      node.children.get(word.substring(0, 1)) ||
      node.children
        .set(word.substring(0, 1), new Node(word.substring(0, 1)))
        .get(word.substring(0, 1))!;
    if (word.length === 1) {
      child.isWordEnd = true;
    } else {
      this.addChildren(word.substring(1), child);
    }
  }
  private removeChildren(word: string, node: Node): boolean {
    if (!node.children) return false;
    const child = node.children.get(word.substring(0, 1));
    if (!child) return false;
    if (word.length === 1) {
      child.isWordEnd = undefined;
      if (!child.children) {
        if (node.children.size === 1) {
          node.children = undefined;
          return true;
        }
        return node.children.delete(word.substring(0, 1));
      }
      return false;
    }
    const grantChildrenRemoved = this.removeChildren(word.substring(1), child);
    if (
      grantChildrenRemoved &&
      !child.children &&
      child.isWordEnd === undefined
    ) {
      if (node.children.size === 1) {
        node.children = undefined;
        return true;
      }
      return node.children.delete(word.substring(0, 1));
    }
    return false;
  }
  private search(word: string, node: Node): boolean {
    if (!node.children) return false;
    const child = node.children.get(word.substring(0, 1));
    if (!child) return false;
    if (word.length === 1) {
      if (child.isWordEnd === true) return true;
      return false;
    }
    return this.search(word.substring(1), child);
  }
}
