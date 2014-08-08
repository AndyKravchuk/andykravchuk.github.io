/**
* Главный модуль
*/
function module() {

	/**
	 * Функция-конструктор
	 */
	function Grid() {

		var i;

		/**
		 * Инициализация 16 клеток
		 * cell0-15:{posX: ,posY: ,id: ,value: }
		 */
		for (i = 0; i < 16; i++) {
			this['cell' + i] = {posX:'',posY:'',id:'',value:''};
		}
	}

	/**
	 * setCellsValues устанавливает начальные значения объектам Cell
	 */
	Grid.prototype.setCellsValues = function() {

		var arr,
			i,
			colum = 0,
			row = 0;

		arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

		arr.sort(function() {
	 		return 0.5 - Math.random();
		});

		function canBeSolved() {
			var current,
				indexOf0,
				counter = 0,
				j;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === 0) {
					continue;
				}

				current = arr[i];
				for (j = i +1; j < arr.length; j++ ) {

					if (arr[j] === 0) {
						continue;
					}

					if (current > arr[j]) {
						counter += 1;
					}
				}
			}
			if (arr.indexOf(0) < 4) {
				indexOf0 = 1;
			}
			else if (arr.indexOf(0) < 8) {
				indexOf0 = 2;
			}
			else if (arr.indexOf(0) < 12) {
				indexOf0 = 3;
			}
			else {
				indexOf0 = 4;
			}

			if ((counter + indexOf0-1) % 2){
				return true;
			}
			else {
				return false;
			}
		}

		var a = canBeSolved();

		while(!a)
		{
			arr.sort(function() {
	 		return 0.5 - Math.random();
			});
			a = canBeSolved();
		}

		for (i in arr) {

			if (colum === 4) {
				colum = 0;
				row += 1;
			}

			this['cell'+[arr[i]]].posX = colum;
			this['cell'+[arr[i]]].posY = row;
			this['cell'+[arr[i]]].id = i;
			this['cell'+[arr[i]]].value = arr[i];
			colum += 1;
		}
	}

	/**
	 * displayCellsValues записывает cell.value в innerHTML соотвествующего Div'a
	 */
	Grid.prototype.displayCellsValues = function() {

		var a,
			i,
			divs,
			temp;

		divs = $('.cell');

		for (i = 0; i < 16; i++) {

			for (var cell in this) {

				if (!(this.hasOwnProperty(cell))) {
					continue;
				}

				if ((this[cell].value === 0)&&(i === 15)) {
					continue;
				}

				if (this[cell].value === 0) {
					a = document.getElementById(this[cell].id);
					a.style.visibility = "hidden";
					continue;
				}

				if (+this[cell].id === i) {
					divs[i]['innerHTML'] = this[cell].value;
				}
		 	}
		}
	}

	/**
	 * Функция привязки обработчиков клик ивентов к Div-вам
	 */
	Grid.prototype.addClickListeners = function() {

		var divs;

		// К Div-у Refresh
		$('#button').click(this.refresh);

		// К 16 Div-ам клеток
		divs = $('.cell');
		divs.click(this.move);
	};
	/**
	 *  Функция движения клеток
	 */
	Grid.prototype.move = function() {

		var a,
			b,
			cell,
			buffId,
			buffX,
			buffY,
			empty,
			emptyX,
			emptyY,
			that,
			thatX,
			thatY,
			counter = 0;

		// Поиск нажатой клетки и сохранение в that
		for (cell in grid) {

			if (!(grid.hasOwnProperty(cell))) {
				continue;}

			if (this.id === (grid[cell].id)) {
	   			that = cell;
	   			thatX = grid[cell].posX;
	   			thatY = grid[cell].posY;
			}
		}

		// Поиск пустой клетки и сохрянение в empty
		for (cell in grid) {

			if (!(grid.hasOwnProperty(cell))) {
			continue;
			}

			if (grid[cell].value === 0) {
				empty = cell;
				emptyX = grid[cell].posX;
				emptyY = grid[cell].posY;
				break;
			}
		}

		// Движени по горизонтали
		// to the right
		if ((thatY === emptyY)&&(thatX === emptyX-1)) {
			exchangeProperties(empty,that);
		}

		// to the left
		else if ((thatY === emptyY)&&(thatX === emptyX+1)) {
			exchangeProperties(empty,that);
		}

		// Движение по вертикали
		// to the top
		else if ((thatX === emptyX)&&(thatY === emptyY+1)) {
			exchangeProperties(empty,that);
		}

		// to the bottom
		else if ((thatX === emptyX)&&(thatY === emptyY-1)) {
			exchangeProperties(empty,that);
		}

		// Проверка состояния Грида
		for (cell in grid) {

			if (!(grid.hasOwnProperty(cell))) {
				continue;
			}

			if ((+grid[cell].id+1) === grid[cell].value) {
				counter += 1;
			}

			if (counter === 15) {
				alert("Congrats!");
				location.reload();
			}
		}

		/**
		 * Функция обмена свойствами id: ,posX: ,posY: ,между клетками
		 */
		function exchangeProperties(from,to) {

			// Поиск и отрисовка спрятаного элемента
			a = document.getElementById(grid[from].id);
			a.style.visibility = "visible";
			a.innerHTML = grid[to].value;

			// Поиск и добавление свайства hidden в будущую пустую клетку
			b = document.getElementById(grid[to].id);
			b.style.visibility = "hidden";
			b.innerHTML = '.';

			// Обмен свойствами
			buffId = grid[from].id;
			buffX = grid[from].posX;
			buffY = grid[from].posY;

			grid[from].id = grid[to].id;
			grid[from].posX = grid[to].posX;
			grid[from].posY = grid[to].posY;

			grid[to].id = buffId;
			grid[to].posX = buffX;
			grid[to].posY = buffY;
		}
	}

	/**
	 * Функция для Refresh button
	 */
	Grid.prototype.refresh = function() {
		grid = null;
		location.reload();
	}

	var grid = new Grid();

	grid.setCellsValues();
	grid.displayCellsValues();
	grid.addClickListeners();
}
