class Tree {
	constructor(value) {
		this.value = value;
		this.childs = [];
		this.peso = Infinity;
		this.isFolha = false;
	}
}


function createTree(t, who, profundidade) {
	var m = t.value;
	var childs = t.childs;
	for (i in m) {
		if (m[i] == 0) {
			var mm = [...m];
			mm[i] = who;
			var tree = new Tree(mm);

			var stateValue = checkStateValue(mm);
			if (stateValue == Infinity) {
				if (who == 1) {
					createTree(tree, 2, profundidade + 1);
				} else {
					createTree(tree, 1, profundidade + 1);
				}
			} else {
				if(stateValue == 10){
					tree.peso = stateValue - profundidade;
				}else if(stateValue == -10){
					tree.peso = stateValue + profundidade;
				}else{
					tree.peso = stateValue;
				}
				
				tree.isFolha = true;
			}

			childs.push(tree);
		}
	}
}

function checkStateValue(s) {
	// create de board
	var mt = [];
	mt.push([s[0], s[1], s[2]]);
	mt.push([s[3], s[4], s[5]]);
	mt.push([s[6], s[7], s[8]]);
	//
	var h = checkStateValueHorizontal(mt);
	if (h != 0) {
		return h;
	}
	var v = checkStateValueVertical(mt);
	if (v != 0) {
		return v;
	}
	var d = checkStateValueDiagonal(mt);
	if (d != 0) {
		return d;
	}
	var isFull = checkBoardIsFull(mt);
	if (isFull) {
		return 0;
	}
	return Infinity;
}

function checkStateValueHorizontal(mt) {
	for (i in mt) {
		if (mt[i][0] == mt[i][1] && mt[i][0] == mt[i][2] && mt[i][0] != 0) {
			if (mt[i][0] == 1) {
				return 10;
			} else {
				return -10;
			}
		}
	}
	return 0;
}
function checkStateValueVertical(mt) {
	for (i in mt) {
		if (mt[0][i] == mt[1][i] && mt[0][i] == mt[2][i] && mt[0][i] != 0) {
			if (mt[0][i] == 1) {
				return 10;
			} else {
				return -10;
			}
		}
	}
	return 0;
}

function checkStateValueDiagonal(mt) {
	var value = 0;
	if (
		((mt[0][0] == mt[1][1] && mt[0][0] == mt[2][2]) ||
			(mt[2][0] == mt[1][1] && mt[2][0] == mt[0][2])) &&
		mt[1][1] != 0
	) {
		if (mt[1][1] == 1) {
			value = 10;
		} else {
			value = -10;
		}
	}
	return value;
}
function checkBoardIsFull(mt) {
	var finished = true;
	for (i in mt) {
		for (j in mt[i]) {
			if (mt[i][j] == 0) {
				finished = false;
			}
		}
	}
	return finished;
}

function minimax(tree) {
	
	var bestMove = -Infinity;
	var bestMoveId = 0;
	for(i in tree.childs){
		var bm = TTTmin(tree.childs[i]);
		if(bm > bestMove){
			bestMove = bm;
			bestMoveId = i;
		}
	}
	var child = tree.childs[bestMoveId];
	if(child == undefined){
		return -1;
	}
	return child.value;
}

function TTTmax(tree) {
	if (tree.isFolha) {
		return tree.peso;
	}
	var max = -Infinity;
  	var maxId = 0;
	for (t in tree.childs) {
		var maxTemp = TTTmin(tree.childs[t]);
	    if(maxTemp > max){
	      max = maxTemp;
	      maxId = t;
	    }
	}
	return max;
}
function TTTmin(tree) {
	if (tree.isFolha) {
		return tree.peso;
	}
	var min = Infinity;
  	var minId = 0;
	for (t in tree.childs) {
		var minTemp = TTTmax(tree.childs[t]);
	    if(minTemp < min){
	      min = minTemp;
	      minId = t;
	    }
	}
	return min;
}

function findSubTreeByState(m){

	return findSubTreeByStateRec(treeRoot, m);
}
function findSubTreeByStateRec(tree, m){
	if(compareArrays(tree.value, m)){
		return tree;
	}
	for(i in  tree.childs){
		var temp = findSubTreeByStateRec(tree.childs[i], m);
		if(temp != undefined){
			return temp;
		}
	}
	return undefined;
}
function compareArrays(m, n){
	if(m.length != n.length){
		return false;
	}
	for(i in m){
		if(m[i] != n[i]){
			return false;
		}
	}
	return true;
}
function getJogadaBy2States(m, n){
	for (i in n) {
		if(m[i] != n[i]){
			return i;
		}
	}
}
function arrayToMatrixValue(m, pos){
	if(pos < 3){
		return [0, Number(pos)];
	}
	if(pos < 6){
		return [1, (Number(pos) - 3)];
	}
	if(pos < 9){
		return [2, (Number(pos) - 6)];
	}
	return undefined;
}

var matriz = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var treeRoot = new Tree(matriz);

module.exports.start = function(){
	
	console.log('Criando arvore com os estados...');
	createTree(treeRoot, 1, 0);
	console.log('Arvore criada.');
	
}

function arrayToMatrix(s){
	var mt = [];
	mt.push([s[0], s[1], s[2]]);
	mt.push([s[3], s[4], s[5]]);
	mt.push([s[6], s[7], s[8]]);
	return mt;
}

function addPosToArray(mm, pos, who){
	var m = arrayToMatrix(mm);
	var mt = [];
	for(i in m){
		for(j in m[i]){
			if(i == pos[0] && j == pos[1]){
				if(m[i][j] == "⬛" || m[i][j] == 0){
					mt.push(who);
				}else{
					return null;
				}
				continue;
			}
			mt.push(m[i][j]);
		}
	}
	return mt;
}

exports.arrayToStringArray = function(a, p, who){
	var array = a;
	var table = [];
	var pos = [];
	
	if(p != null){
		if(p.length == 1){
			pos[0] = Math.floor(p[0]/3);
			pos[1] = p[0] - (pos[0]*3)
		}else{
			pos = p;
		}
		console.log(pos)
		array = addPosToArray(a, pos, who)
		if(array == null){
			return null;
		}
	}

	for(i in array){
		if(array[i] == 0 || array[i] == "⬛"){
			table.push("⬛");
		}else if(array[i] == 1 || array[i] == "⭕"){
			table.push("⭕");
		}else{
			table.push("❌");
		}
	}
	
	return table;
}

function arrayToIntArray(a){
	var mm = [];
	for(i in a){
		if(a[i] == "⬛"){
			mm.push(0);
		}else if(a[i] == "⭕"){
			mm.push(1);
		}else{
			mm.push(2);
		}
	}
	return mm;
}

module.exports.getJogada = function(mm){
	console.log('Aplicando o MinMax na arvore...');
	var m;
	if(typeof mm[0] == 'number'){
		m = mm;
	}else{
		m = arrayToIntArray(mm)
	}

	var subTree = findSubTreeByState(m);
	var bestMove = minimax(subTree);
	if(bestMove == -1){
		return [-1, -1];
	}
	var melhorJogada = arrayToMatrixValue(m, getJogadaBy2States(m, bestMove));
	return exports.arrayToStringArray(m, melhorJogada, 2)
}
exports.wintoria = function(ss) {
	// create de board
	var s = arrayToIntArray(ss)
	var mt = [];
	mt.push([s[0], s[1], s[2]]);
	mt.push([s[3], s[4], s[5]]);
	mt.push([s[6], s[7], s[8]]);
	//
	var h = checkStateValueHorizontal(mt);
	if (h != 0) {
		return h;
	}
	var v = checkStateValueVertical(mt);
	if (v != 0) {
		return v;
	}
	var d = checkStateValueDiagonal(mt);
	if (d != 0) {
		return d;
	}
	var isFull = checkBoardIsFull(mt);
	if (isFull) {
		return 0;
	}
	return Infinity;
}