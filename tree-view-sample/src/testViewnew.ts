import * as vscode from 'vscode';
import { activate } from './extension';

//import tree = require('./testview.json');
import * as tree from './testview.json';

export class TestView {
	constructor(context: vscode.ExtensionContext) {


		console.log('TestView constructor', tree);


		const view = vscode.window.createTreeView('testView', {
			treeDataProvider: aNodeWithIdTreeDataProvider(),
			showCollapseAll: true,
		});
		context.subscriptions.push(view);
		vscode.commands.registerCommand('testView.reveal', async () => {
			const key = await vscode.window.showInputBox({
				placeHolder: 'Type the label of the item to reveal',
			});
			if (key) {
				await view.reveal({ key }, { focus: true, select: false, expand: true });
			}
		});
		vscode.commands.registerCommand('testView.changeTitle', async () => {
			const title = await vscode.window.showInputBox({
				prompt: 'Type the new title for the Test View',
				placeHolder: view.title,
			});
			if (title) {
				view.title = title;
			}
		});

		vscode.commands.registerCommand('testView.customFunction', args => {
			/*
			customFunction(args).then((result) => {
			//searchTree(tree, args).then((result) => {
				console.log('Search Result:', result);
			});
			*/
			const clickedItem = searchTree(tree, args.key);
			console.log('Clicked Item:', clickedItem);
			vscode.window.showInformationMessage(JSON.stringify(clickedItem));
			//vscode.window.showInformationMessage('This is a custom function');
			customFunction(context, args.key);
			

			// Example usage:
			/*
			searchTreeAsync(tree, args.key).then((result) => {
				console.log('Search Result:', result);
			});
			*/
		});
	}
}


async function searchTreeAsync(tree: any, arg: string): Promise<any> {
	return new Promise((resolve, reject) => {
		// Iterate over each key in the tree object
		for (const key in tree) {
			// Check if the current key matches the search argument
			if (key === arg) {
				// Return the value associated with the matching key
				resolve(tree[key]);
			}
			// Check if the value of the current key is an object
			if (typeof tree[key] === 'object') {
				// Recursively search the nested object
				searchTreeAsync(tree[key], arg).then((result) => {
					// If a match is found in the nested object, resolve the result
					if (result) {
						resolve(result);
					}
				});
			}
		}
		// If no match is found, resolve with null
		resolve(null);
	});
}



function searchTree(tree: any, arg: string): any {
	// Iterate over each key in the tree object
	for (const key in tree) {
		// Check if the current key matches the search argument
		if (key === arg) {
			// Return the value associated with the matching key
			return tree[key];
		}
		// Check if the value of the current key is an object
		if (typeof tree[key] === 'object') {
			// Recursively search the nested object
			const result = searchTree(tree[key], arg);
			// If a match is found in the nested object, return the result
			if (result) {
				return result;
			}
		}
	}
	// If no match is found, return null
	return null;
}

function searchTreeAsync(tree: any, arg: string): Promise<any> {
	return new Promise((resolve, reject) => {
		// Iterate over each key in the tree object
		for (const key in tree) {
			// Check if the current key matches the search argument
			if (key === arg) {
				// Return the value associated with the matching key
				resolve(tree[key]);
			}
			// Check if the value of the current key is an object
			if (typeof tree[key] === 'object') {
				// Recursively search the nested object
				searchTree(tree[key], arg).then((result) => {
					// If a match is found in the nested object, resolve the result
					if (result) {
						resolve(result);
					}
				});
			}
		}
		// If no match is found, resolve with null
		resolve(null);
	});
}



/*
function openFileInResourcesFolder(fileName: string): void {
	const resourceUri = vscode.Uri.joinPath(context.extensionUri, 'resources', fileName);
	vscode.workspace.openTextDocument(resourceUri).then((document) => {
		vscode.window.showTextDocument(document);
	});
}
*/




function customFunction(context: vscode.ExtensionContext, args: any) {
	vscode.window.showInformationMessage('This is a custom function');

	const resourceFilePath = vscode.Uri.joinPath(context.extensionUri, 'resources', 'test.html');

	vscode.workspace.openTextDocument(resourceFilePath).then((document) => {
		const htmlText = document.getText();
		vscode.workspace.openTextDocument().then((document) => {
			
			vscode.window.showTextDocument(document, { preview: false }).then((editor) => {
				
				editor.edit((editBuilder) => {
					editBuilder.insert(new vscode.Position(0, 0), htmlText);
				});
			});
			
		});


		//vscode.window.showInformationMessage('html file: ',htmlText);
	});

	

	vscode.workspace.openTextDocument(resourceFilePath).then((document) => {
		vscode.window.showTextDocument(document, { preview: false });
	});

	vscode.workspace.openTextDocument().then((document) => {
		//vscode.window.showTextDocument(document, { preview: false });
	});


	return;
	
	//console.log(args);

	//const clickedItem = args.key;
	//console.log(clickedItem);


	const searchResult = searchTree(tree, args.key);
	console.log('Search Result:', searchResult);

	return;










	const varconsole = vscode.window.createOutputChannel('Custom Function');
	varconsole.appendLine('This is a custom function in the console.');
	varconsole.appendLine(tree);
	varconsole.show();
	console.clear();
	console.log('this is a custom message in the console');
	console.log(tree);
}

const tree1: any = {
	a: {
		aa: {
			aaa: {
				test: {},
				test2: {},
				aaaa: {
					aaaaa: {
						aaaaaa: {},
					},
				},
			},
		},
		ab: {
			testab: { test: 'TestValue', test2: 'TestValue2' },
		},
	},
	b: {
		ba: {},
		bb: {},
		dd: {
			testdd: { test: 'DDvalue1', test2: 'DDvalue2' },
		}
	},
};
const nodes: any = {};

function aNodeWithIdTreeDataProvider(): vscode.TreeDataProvider<{ key: string }> {
	return {
		getChildren: (element: { key: string }): { key: string }[] => {
			return getChildren(element ? element.key : undefined).map((key) =>
				getNode(key)
			);
		},
		getTreeItem: (element: { key: string }): vscode.TreeItem => {
			const treeItem = getTreeItem(element.key);
			treeItem.id = element.key;
			if (getChildren(element.key).length) {
				treeItem.contextValue = 'svgParentItem';
			} else {
				treeItem.contextValue = 'svgItem';
			}
			return treeItem;
		},
		getParent: ({ key }: { key: string }): { key: string } | undefined => {
			const parentKey = key.substring(0, key.length - 1);
			return parentKey ? new Key(parentKey) : undefined;
		},
	};
}

function getChildren(key: string | undefined): string[] {
	if (!key) {
		return Object.keys(tree);
	}
	const treeElement = getTreeElement(key);
	if (treeElement) {
		return Object.keys(treeElement);
	}
	return [];
}

function getTreeItem(key: string): vscode.TreeItem {
	const treeElement = getTreeElement(key);
	// An example of how to use codicons in a MarkdownString in a tree item tooltip.
	const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${key}`, true);
	return {
		label: /**vscode.TreeItemLabel**/ <any>{
			label: key,
			highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0,
		},
		tooltip,
		collapsibleState:
			treeElement && Object.keys(treeElement).length
				? vscode.TreeItemCollapsibleState.Collapsed
				: vscode.TreeItemCollapsibleState.None,
	};
}

function getTreeElement(element: string): any {
	let parent = tree;
	for (let i = 0; i < element.length; i++) {
		parent = parent[element.substring(0, i + 1)];
		if (!parent) {
			return null;
		}
	}
	return parent;
}

function getNode(key: string): { key: string } {
	if (!nodes[key]) {
		nodes[key] = new Key(key);
	}
	return nodes[key];
}

class Key {
	constructor(readonly key: string) { }
}
