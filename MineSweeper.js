$(document).ready(function (){
   $("#start").click(createBoard)
});

const COLS=40;
const ROWS=40;
const $board = $('#board');
var flagcount = 0;
    
function createBoard(){  
var mines = $('#mines').val();
var rows   = $('#rows').val();
var columns = $('#columns').val();

flagcount=0;    
NumOfMinesLeft();

    if(rows < 8 || rows >30 || columns>40|| columns<8 ||  mines<1 || mines>=rows*columns){
    restart();
    alert("To play this game you must meet the following criteria: 8 to 30 rows, 8 to 40 columns, must have at least 1 mine and maximum number of mines has to  be less than number of rows times columns")
    }
	else{  
    $board.empty();
		for(let i =0; i<rows; i++){
			const $row=$('<div>').addClass('row');
			for(let j=0; j<columns; j++){
				const $col = $('<div>').addClass('col s').attr('data-row', i).attr('data-col', j);         
				$row.append($col);
			}			
            $board.append($row);
		} 
		makebomb();
	}
}

function NumOfMinesLeft(){
    var elt = document.getElementById("minesleft");
    var minesLeft = $('#mines').val()-flagcount;
    elt.innerHTML = minesLeft;
}

function makebomb(){
    for(let i=0; i < $('#mines').val();i++){
        var randRow=Math.floor(Math.random()*$('#rows').val());
        var randCol=Math.floor(Math.random()*$('#columns').val());        
        const $cell = $(`.col.s[data-row=${randRow}][data-col=${randCol}]`);        
		if($cell.hasClass('mine')){
			i--;
		}
		else{
			$cell.addClass('mine');
		}
    }
}

function goodgame(gg){
    let mesasge = null;
    if(gg){
		message='Congrats You Won';
	}
    else{
		message='You Lost Haha';
	}
    $(`.col.mine`).addClass('mine');
    
    setTimeout(function(){
    alert(message);
    restart();},250);       
}


function see(p, q){
    const seen = {};    
    function helper(i, j){
        if(i >= ROWS || j>=COLS || i<0 || j<0)return;
        const key = '${i} ${j}'
        if (seen[key])return;
        const $cell = $(`.col.s[data-row=${i}][data-col=${j}]`);
        const mineCount = getminecount(i,j);
        if(!$cell.hasClass('s') || $cell.hasClass('mine') || $cell.hasClass('k')){return;}
        $cell.removeClass('s');
        
        if(mineCount){
            $cell.text(mineCount);
            $cell.addClass('g');
            return;
        }
        
        for(let di = -1; di <= 1; di++){
            for(let dj = -1; dj <= 1; dj++){
              helper(i+di, j+dj);
		    }
        }
    }
            helper(p, q);
}

function getminecount(i, j){
    let count = 0;
    for(let di = -1; di <= 1; di++){
        for(let dj = -1; dj <= 1; dj++){
         const ni = i + di;
         const nj = j+ dj;
            if(ni>=ROWS || nj>=COLS || nj<0 || ni<0){
                continue;
            }
              const $cell = $(`.col.s[data-row=${ni}][data-col=${nj}]`);
              if($cell.hasClass('mine')) count++;
        }
    }
    return count;
}

$board.on('click', '.col.s', function(e){
    
    const $cell = $(this);
    const row = $cell.data('row');
    const col = $cell.data('col');
    
    if(e.shiftKey){
        if($cell.hasClass('k')){
            $cell.removeClass('k');
            flagcount--;
            NumOfMinesLeft();
        }else{
            $cell.addClass('k');
            flagcount++;
            NumOfMinesLeft();
        }
    }    
    else{
		if($cell.hasClass('k'))return;
		console.log(row, col);
		if($cell.hasClass('mine')){
			goodgame(false);
		}else{
			see(row, col);
			const isGameOver = $(`.col.s`).length===$(`.col.mine`).length;
			if(isGameOver) goodgame(true);
		}
    }
})

function restart(){
    $board.empty();
}

$board.on('click','.col.g', function(){ 
    const $cell = $(this);
    const col = $cell.data('col');
    const row = $cell.data('row');
    var cc = 0;
    const count = getminecount($cell.data('row'), $cell.data('col'));

    for(let di = -1; di<= 1; di++){
        for(let dj = -1; dj <= 1; dj++){
        const $cell = $(`.col.s[data-row=${di+row}][data-col=${dj+col}]`);
            if($cell.hasClass('k')){cc++;}
        }
    }
    if (cc === count){
        for(let di = -1; di<= 1; di++){
            for(let dj = -1; dj <= 1; dj++){
             const $cell = $(`.col.s[data-row=${di+row}][data-col=${dj+col}]`);
                if(!($cell.hasClass('k'))){
                    if($cell.hasClass('mine')){goodgame(false);}   
                    else {
						see(di+row, dj+col);
					}
                }
            }
        }
    }
})