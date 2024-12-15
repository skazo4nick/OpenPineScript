import { Token } from "./tokens";

export interface SearchTreeNode<T> {
    value: T|null;
    children: Record<string, SearchTreeNode<T>>;
}

export function addToSearchTree(root: SearchTreeNode<Token>, token: Token) {
    let currentNode = root;

    for (const char of token.value) {
        if (!currentNode.children[char]) {
            currentNode.children[char] = { value: null, children: {} };
        }
        currentNode = currentNode.children[char];
    }
    currentNode.value = token;
}

export function buildSearchTree(tokens: Token[]): SearchTreeNode<Token> {
    const root: SearchTreeNode<Token> = { value: null, children: {} };
    for(let token of tokens) {
        addToSearchTree(root, token);
    }
    return root;
}

