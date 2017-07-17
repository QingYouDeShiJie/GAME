(function(){
	var Map = window.Map = function(){
		//矩阵
		this.matrix = [
			[_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5)],
			[_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5)],
			[_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5)],
			[_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5)],
			[_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5)],
			[_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5)],
			[_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5)],
			[_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5),_.random(0,5)],
			[]
		];
		
		this.createSpritesByMatrix();

	}
	//根据矩阵创建精灵
	Map.prototype.createSpritesByMatrix = function(){
		this.sprites = [];	//二维数组
		//遍历每一行
		for(var r = 0 ; r < game.rowamount ; r++){
			var _temp = [];
			for(var c = 0 ; c < game.colamount ; c++){
				_temp.push(new Sprite(r,c,this.matrix[r][c]));
			}
			this.sprites.push(_temp);
		}
	}
	//渲染
	Map.prototype.render = function(){
		//渲染自己精灵矩阵中的所有精灵
		for(var r = 0 ; r < game.rowamount ; r++){
			for(var c = 0 ; c < game.colamount ; c++){
				
				this.sprites[r][c].render();
			}
		}
	}
	//检查是否能消除
	Map.prototype.check = function(){
		var results = [];
		//先去按行检查
		for(var r = 0 ; r < game.rowamount ; r++){
			
			var i = 0;
			var j = 1;
			while(j <= game.rowamount){
				if(this.matrix[r][i] != this.matrix[r][j]){
					
					if(j - i >= 3){
						for(var m = i ; m < j ; m++){
							results.push(this.sprites[r][m]);
						}
					}
					i = j;
				}
				j++;
			}
		}

		
		for(var c = 0 ; c < game.colamount ; c++){
			
			var i = 0;
			var j = 1;
			while(j <= game.rowamount){
				if(this.matrix[i][c] != this.matrix[j][c]){
					
					if(j - i >= 3){
						for(var m = i ; m < j ; m++){
							results.push(this.sprites[m][c]);
						}
					}
					i = j;
				}
				j++;
			}
		}
 
		var results = _.uniq(results);
		return results;
	}
	//爆炸
	Map.prototype.bomb = function(){
		var needbomb = this.check();
		for(var i = 0 ; i < needbomb.length ; i++){
			needbomb[i].bomb();
		
			this.matrix[needbomb[i].row][needbomb[i].col] = "■";
		}
	}
	//下落 
	Map.prototype.drop = function(){
		
		this.dropnumber = [[],[],[],[],[],[],[],[]];
		//看看当前的matrix，依次遍历每一个元素，计算这个元素应该下落的行数。就是统计这个元素下面的■的个数。
		for(var row = game.rowamount - 1 ; row >= 0; row--){
			for (var col = 0; col < game.colamount; col++) {
				var sum = 0;
				for(var _row = row + 1 ; _row < game.rowamount ; _row++){
					if(this.matrix[_row][col] == "■"){
						sum++;
					}
				}
				
				this.dropnumber[row][col] = sum;
		
				document.getElementById("droptable").getElementsByTagName("tr")[row].getElementsByTagName("td")[col].innerHTML = sum;
			
				this.sprites[row][col].moveTo(row + sum , col);
				
				if(sum != 0){
					this.matrix[row + sum][col] = this.matrix[row][col];
					this.matrix[row][col] = "■";
				}
			}
		}
	}
	//补充新的
	Map.prototype.supplement = function(){

		this.createSpritesByMatrix();

		for(var row = 0 ; row < game.rowamount ; row++){
			for (var col = 0; col < game.colamount; col++) {
				if(this.matrix[row][col] == "■"){
					var stype = _.random(0,5);
					
					this.sprites[row][col] = new Sprite(row , col , stype);
					
					this.sprites[row][col].y = 0;
					
					this.sprites[row][col].moveTo(row, col);
				
					this.matrix[row][col] = stype;
				}
			}
		}
	}
})();