
// simulates keypress if onscreen buttons are pressed
let ev = document.createEvent('Events');
ev.initEvent('keydown', true, true);

// functions for on screen buttons 
function up(){    
ev.code = 'ArrowUp';
document.dispatchEvent(ev);
}
function down(){    
ev.code = 'ArrowDown';
document.dispatchEvent(ev);
}
function left(){    
ev.code = 'ArrowLeft';
document.dispatchEvent(ev);
}
function right(){    
ev.code = 'ArrowRight';
document.dispatchEvent(ev);
}

// start button on home page
let start_button = document.querySelector('#start');

// stop button when you quit the page
let stop_button = document.querySelector('#stop');
let stop = document.querySelector('.stop');


stop_button.addEventListener('click',function(){

    location.reload();
});

start_button.addEventListener('click',function(){

    // section containing the start button
    let home = document.querySelector('.home');

    // hides the button once the user presses start
    home.className='hide';

    let playarea_width = Math.floor(innerWidth/2);
    let playarea_height = Math.floor((innerHeight-100)/2);
    let snake = [];
    let food = {x:null,y:null};
    let html='';
    let abc=0;
    let key = null;
    let speed;
    let length = 5;
    let score = 0;
    let initial_state = false;
    document.querySelector('p').innerText=`Score : ${score}`;

    // determines the speed according to the level selected by the user
    let level = document.getElementsByName('level');
    for(id of level){
        if(id.checked){
            console.log(id.value);
            switch (id.value){
                case 'easy':
                    speed = 60;
                    break;
                case 'medium':
                    speed = 30;
                    break;
                case 'hard':
                    speed = 15;
                    break;
            }
        }
    }

    // builds the snake using div elements
    for(abc ;abc<25;abc++){

        html=html+`<div class='snake${abc}'></div>`
        snake.push({x: playarea_width,y: playarea_height});
        playarea_width-=length;
    }

    // injects the snake in html
    document.querySelector('main').innerHTML=html
    let body = document.querySelectorAll('div');
    console.log(snake);


    // calls the function which sends the coordinates of the snake via css variables
    for(id in snake){

        show_snake(id);
    }
    generate_food();

    //  variable t contains setinterval function
    let t;


    document.addEventListener('keydown',function(){

        // if the user presses Escape the game stops
        if(event.code == 'Escape'){
            stop_snake();
            stop.className='stop';
            stop_button.innerText=`Score : ${score}\n Start Again`
            return;
        }

        switch(event.code)
        {
            case 'ArrowUp':
                if(key != 'ArrowDown')
                {
                    key = event.code;
                }
                break;
            case 'ArrowDown':
                if(key != 'ArrowUp')
                {
                    key = event.code;
                }
                break;
            case 'ArrowLeft':
                if(key != 'ArrowRight')
                {
                    key = event.code;
                }
                break;
            case 'ArrowRight':
                if(key != 'ArrowLeft')
                {
                    key = event.code;
                }
        }

        // the snake is static when the user first starts the game, this ensures that the snake does not go reverse
        if(key != 'ArrowLeft')
        {
            initial_state = true;
        }

        if(key == 'ArrowUp' ){
            stop_snake();
            t=setInterval(function(){
                move_snake();
                align_snake(5,15,180);
                snake[0].y-=length;    
            },speed);
            
        }
        else if(key == 'ArrowDown'){
            stop_snake();
            t=setInterval(function(){
                move_snake();
                align_snake(-5,5,0);
                snake[0].y+=length;    
            },speed);
        }
        else if(key == 'ArrowLeft' && initial_state){
            stop_snake();
            t=setInterval(function(){
                move_snake();
                align_snake(-5,15,90);
                snake[0].x-=length;    
            },speed);
        }
        else if(key == 'ArrowRight'){
            stop_snake();
            t=setInterval(function(){
                move_snake();
                align_snake(5,5,-90);
                snake[0].x+=length;    
            },speed);
        }
    });


    // generates food randomly on the viewport
    function generate_food(){

        food.x = Math.floor(Math.random()*(innerWidth-20));
        food.y = Math.floor(Math.random()*(innerHeight-120));

        // ensures that food is not generated on the snake's body
        for(id of snake){
            if( Math.floor(id.x/10) == Math.floor(food.x/10)   &&  Math.floor(id.y/10) == Math.floor(food.y/10) ){
                generate_food();
            }
        }
        // displays the food via css variables
        let food_position = document.querySelector('article');
        food_position.style.setProperty("--posX",`${food.x}px`);        
        food_position.style.setProperty("--posY",`${food.y}px`);
    }

    function stop_snake(){

        clearInterval(t);
    }

    function move_snake(){

        for(let c=snake.length-1;c>0;c--)
        {
            // if the snake's head collides with it's body then the game ends 
            if(snake[c].x==snake[0].x && snake[c].y==snake[0].y)
            {
                    
                    stop_snake();
                    for(id in snake){
                        body[id].style.setProperty("--color",'red');
                    }
                    stop.className='stop';
                    stop_button.innerText=`Score : ${score}\n Start Again`
                    return;
                    
                }
            
            
            // if the snake reaches the food then this increases the size and speed of the snake
            let sx = Math.floor((snake[0].x)/10);
            let sy = Math.floor((snake[0].y)/10);
            let fx = Math.floor((food.x)/10);
            let fy = Math.floor((food.y)/10);
            if(((sx==fx || sx==fx+1)|| sx==fx-1) && ((sy==fy || sy==fy+1)|| sy==fy-1)){
                snake.push({x: snake[abc-1].x, y:snake[abc-1].y});
                score++;
                document.querySelector('p').innerText=`Score : ${score}`;
                generate_food();
                speed-=1;
                html=html+`<div class='snake${abc}'></div>`;
                abc++;
                console.log(html);
                document.querySelector('main').innerHTML=html;
                body = document.querySelectorAll('div');
                continue;
            }

            // moves the snake forward according to the user's input
            if(snake[0].x < 0){
                snake[0].x = innerWidth-30;
            }
            else if(snake[0].x > innerWidth-30){
                snake[0].x = 0;
            }
            else if(snake[0].y < 0){
                snake[0].y = innerHeight-120;
            }
            else if(snake[0].y > innerHeight-120){
                snake[0].y = 0;
            }

            // gives direction to snake's body except it's head
            if(c>0){
                snake[c].x=(snake[c-1].x);
                snake[c].y=(snake[c-1].y);
            }
            count =0;
            
            // displays the entire body
            show_snake(c);

            // displays the head(it is separate because it is out of the scope of this loop)
            show_snake(0);
        
        }
    }

    function show_snake(pos){

        body[pos].style.setProperty("--posX",`${snake[pos].x}px`);
        body[pos].style.setProperty("--posY",`${snake[pos].y}px`);
    }

    // snake's head is larger than it's body, this ensures that head is in connected correctly to it's body
    function align_snake(middlex,middley,rotation){

        body[0].style.setProperty("--middlex",`${middlex}px`);
        body[0].style.setProperty("--middley",`${middley}px`);
        body[0].style.setProperty("--rotation",`${rotation}deg`);
        
    }

});