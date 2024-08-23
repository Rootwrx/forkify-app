//  function DomUpdater(parentElement, newMarkup) {
//   const newDom = document.createRange().createContextualFragment(newMarkup);
//   const newElements = Array.from(newDom.querySelectorAll("*"));
//   const curElements = Array.from(parentElement.querySelectorAll("*"));

//   curElements.forEach((curEl, i) => {
//     const newEl = newElements[i];
//     if (!newEl) return;

//     // Update text content
//     if (shouldUpdateTextContent(newEl, curEl)) {
//       curEl.textContent = newEl.textContent;
//     }

//     // Update attributes
//     updateAttributes(newEl, curEl);

//     // Update child nodes recursively
//     updateChildNodes(newEl, curEl);
//   });
// }

// function shouldUpdateTextContent(newEl, curEl) {
//   const newText = newEl.firstChild?.nodeValue?.trim();
//   const curText = curEl.firstChild?.nodeValue?.trim();
//   return newText !== undefined && newText !== curText;
// }

// function updateAttributes(newEl, curEl) {
//   // Update or add new attributes
//   Array.from(newEl.attributes).forEach((attr) => {
//     if (curEl.getAttribute(attr.name) !== attr.value) {
//       curEl.setAttribute(attr.name, attr.value);
//     }
//   });

//   // Remove attributes not present in the new element
//   Array.from(curEl.attributes).forEach((attr) => {
//     if (!newEl.hasAttribute(attr.name)) {
//       curEl.removeAttribute(attr.name);
//     }
//   });
// }

// function updateChildNodes(newEl, curEl) {
//   if (newEl.childNodes.length === 0 && curEl.childNodes.length === 0) return;

//   if (!newEl.isEqualNode(curEl)) {
//     const newChildNodes = Array.from(newEl.childNodes);
//     const curChildNodes = Array.from(curEl.childNodes);

//     curChildNodes.forEach((curChild, i) => {
//       const newChild = newChildNodes[i];
//       if (!newChild) return;

//       if (
//         newChild.nodeType === Node.ELEMENT_NODE &&
//         curChild.nodeType === Node.ELEMENT_NODE
//       ) {
//         updateAttributes(newChild, curChild);
//         updateChildNodes(newChild, curChild);
//       } else if (
//         newChild.nodeType === Node.TEXT_NODE &&
//         curChild.nodeType === Node.TEXT_NODE
//       ) {
//         if (newChild.nodeValue !== curChild.nodeValue) {
//           curChild.nodeValue = newChild.nodeValue;
//         }
//       }
//     });
//   }
// }


// export default DomUpdater;


export function updateDOM(parentElement, newMarkup) {
  const newDom = document.createRange().createContextualFragment(newMarkup);

  // Use a document fragment for batching updates
  const fragment = document.createDocumentFragment();

  // Efficient DOM diffing and patching
  diffAndPatch(parentElement, newDom, fragment);

  // Apply all changes at once
  parentElement.appendChild(fragment);
}

function diffAndPatch(currentNode, newNode, fragment) {
  if (!currentNode && newNode) {
    fragment.appendChild(newNode.cloneNode(true));
    return;
  }

  if (currentNode && !newNode) {
    currentNode.remove();
    return;
  }

  if (
    currentNode.nodeType !== newNode.nodeType ||
    currentNode.nodeName !== newNode.nodeName
  ) {
    currentNode.replaceWith(newNode.cloneNode(true));
    return;
  }

  if (currentNode.nodeType === Node.TEXT_NODE) {
    if (currentNode.textContent !== newNode.textContent) {
      currentNode.textContent = newNode.textContent;
    }
    return;
  }

  updateAttributes(currentNode, newNode);

  // Efficient child node diffing
  const currentChildren = Array.from(currentNode.childNodes);
  const newChildren = Array.from(newNode.childNodes);
  const maxLength = Math.max(currentChildren.length, newChildren.length);

  for (let i = 0; i < maxLength; i++) {
    diffAndPatch(currentChildren[i], newChildren[i], currentNode);
  }
}

function updateAttributes(currentNode, newNode) {
  const currentAttrs = currentNode.attributes;
  const newAttrs = newNode.attributes;

  for (const attr of newAttrs) {
    if (currentNode.getAttribute(attr.name) !== attr.value) {
      currentNode.setAttribute(attr.name, attr.value);
    }
  }

  for (const attr of currentAttrs) {
    if (!newNode.hasAttribute(attr.name)) {
      currentNode.removeAttribute(attr.name);
    }
  }
}