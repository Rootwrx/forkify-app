import { TIMEOUT_SEC } from "./config";

const timeout = (s) =>
  new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(new Error(`Request took too long! Timeout after ${s} seconds`)),
      s * 1000
    )
  );

const getJson = async (url) => {
  try {
    const res = await Promise.race([timeout(TIMEOUT_SEC), fetch(url)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

const getRecipeInfo = (recipe) => ({
  id: recipe.id,
  publisher: recipe.publisher,
  image: recipe.image_url,
  title: recipe.title,
  sourceUrl: recipe.source_url,
  servings: recipe.servings,
  ingredients: recipe.ingredients,
  cookingTime: recipe.cooking_time,
});

const getUrlSearchParam = (query) => {
  const url = new URL(window.location.href);

  if (query) {
    url.searchParams.set("search", query);
    window.history.pushState({}, "", url.href);
    return;
  }
  return url.searchParams.get("search");
};

function updateDOM(oldNode, newNode) {
  // Case 1: Nodes are the same type
  if (oldNode.nodeType === newNode.nodeType) {
    // Update text content if they are text nodes
    if (oldNode.nodeType === Node.TEXT_NODE) {
      if (oldNode.textContent !== newNode.textContent) {
        oldNode.textContent = newNode.textContent;
      }
    }

    // Update element nodes
    if (oldNode.nodeType === Node.ELEMENT_NODE) {
      // Update attributes
      updateAttributes(oldNode, newNode);

      // Recursive update of child nodes
      updateChildren(oldNode, newNode);
    }
  } else {
    // Case 2: Nodes are different types, replace the old node with the new node
    oldNode.replaceWith(newNode.cloneNode(true));
  }
}

function updateAttributes(oldNode, newNode) {
  // Remove old attributes not present in newNode
  Array.from(oldNode.attributes).forEach((attr) => {
    if (!newNode.hasAttribute(attr.name)) {
      oldNode.removeAttribute(attr.name);
    }
  });

  // Update existing attributes and add new ones
  Array.from(newNode.attributes).forEach((attr) => {
    if (oldNode.getAttribute(attr.name) !== attr.value) {
      oldNode.setAttribute(attr.name, attr.value);
    }
  });
}

function updateChildren(oldNode, newNode) {
  const oldChildren = Array.from(oldNode.childNodes);
  const newChildren = Array.from(newNode.childNodes);

  const maxLength = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLength; i++) {
    if (!oldChildren[i]) {
      // Case 3: New node has more children, append the new child
      oldNode.appendChild(newChildren[i].cloneNode(true));
    } else if (!newChildren[i]) {
      // Case 4: Old node has more children, remove the excess child
      oldNode.removeChild(oldChildren[i]);
    } else {
      // Case 5: Update existing child nodes
      updateDOM(oldChildren[i], newChildren[i]);
    }
  }
}

// // Usage example:
// const oldDom = document.getElementById('oldTree');
// const newDom = document.getElementById('newTree');

// // Apply changes from newDom to oldDom
// updateDOM(oldDom, newDom);

export { getJson, getRecipeInfo, updateDOM, getUrlSearchParam };
