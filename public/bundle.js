(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){var World=require("./src/world");var config=require("./config.json");var mspf=1e3/config.fps;window.onload=function(){var canvas=document.getElementById("canvas");window.world=new World(canvas);world.load_level();if(!world.has_started){world.music.play_song();world.has_started=true}window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback,element){window.setTimeout(callback,mspf)};(function animloop(){world.update();requestAnimFrame(animloop,canvas)})()}},{"./config.json":2,"./src/world":7}],2:[function(require,module,exports){module.exports={port:8080,bots:5,fps:30,consts:{MAX_PLAYERS:30,NEW_PLAYER_LAG:60,LEADERBOARD_NUM:5,LEVEL_SIZE:800,LEVEL_RADIUS:500,NUM_CELLS:30,FRICTION:.997,PREFIXES:"Angry Baby Crazy Diligent Excited Fat Greedy Hungry Interesting Japanese Kind Little Magic Naïve Old Powerful Quiet Rich Superman THU Undefined Valuable Wifeless Xiangbuchulai Young Zombie",NAMES:"Alice Bob Carol Dave Eve Francis Grace Hans Isabella Jason Kate Louis Margaret Nathan Olivia Paul Queen Richard Susan Thomas Uma Vivian Winnie Xander Yasmine Zach"}}},{}],3:[function(require,module,exports){var config=require("../config.json");module.exports=function(canvas){this.scale_smoothness=.3;this.move_smoothness=.3;this.level_size=config.consts.LEVEL_SIZE;this.canvas=canvas;this.x=0;this.y=0;this.x_target=0;this.y_target=0;this.scale=.5;this.scale_target=1;this.world_to_viewport_x=function(x){return x*this.scale+this.canvas.width/2-this.x*this.scale};this.world_to_viewport_y=function(y){return y*this.scale+this.canvas.height/2-this.y*this.scale};this.viewport_to_world_x=function(x){return(x+this.x*this.scale-this.canvas.width/2)/this.scale};this.viewport_to_world_y=function(y){return(y+this.y*this.scale-this.canvas.height/2)/this.scale};this.update=function(target_x,target_y,frame_delta){this.x_target=target_x;this.y_target=target_y;if(this.scale!=this.scale_target)this.scale=Math.abs(this.scale+frame_delta*(this.scale_target-this.scale)*this.scale_smoothness);if(this.x!=this.x_target)this.x+=frame_delta*(this.x_target-this.x)*this.move_smoothness;if(this.y!=this.y_target)this.y+=frame_delta*(this.y_target-this.y)*this.move_smoothness};this.center=function(){if(this.x==0&&this.y==0){this.x=this.level_size/2;this.y=this.level_size/2}this.x_target=this.x;this.y_target=this.y;this.zoom_to_player()};this.zoom_to_player=function(){this.scale_target=this.level_size/10/world.get_player().radius}}},{"../config.json":2}],4:[function(require,module,exports){var config=require("../config.json");function Cell(xpos,ypos,radius){this.radius=20;this.x_pos=0;this.y_pos=0;this.x_veloc=0;this.y_veloc=0;this.x_veloc_max=100;this.y_veloc_max=100;this.x_min=0;this.x_max=640;this.friction=config.consts.FRICTION;this.horizontalBounce=function(){this.x_veloc=-this.x_veloc};this.verticalBounce=function(){this.y_veloc=-this.y_veloc};this.distance_from=function(other){var dx=this.x_pos-other.x_pos;var dy=this.y_pos-other.y_pos;return Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))};this.collides_with=function(other){return this.distance_from(other)<this.radius+other.radius};this.set_position=function(x,y){this.x_pos=x;this.y_pos=y};this.area=function(){return Math.PI*this.radius*this.radius};if(xpos)this.x_pos=xpos;if(ypos)this.y_pos=ypos;if(radius)this.radius=radius;this.default_x=this.x_pos;this.default_y=this.y_pos;this.dead=false;this.fillStyle="rgb(55,255,85)";this.reset=reset_cell;this.update=update_cell;this.draw=draw_cell}function reset_cell(){this.x_pos=this.default_x;this.y_pos=this.default_y;this.x_veloc=0;this.y_veloc=0;this.dead=false}function update_cell(frame_delta){if(this.dead)return;var xvelsign=this.x_veloc/Math.abs(this.x_veloc);if(Math.abs(this.x_veloc)>this.x_veloc_max)this.x_veloc=xvelsign*this.x_veloc_max;var yvelsign=this.y_veloc/Math.abs(this.y_veloc);if(Math.abs(this.y_veloc)>this.y_veloc_max)this.y_veloc=yvelsign*this.y_veloc_max;this.x_pos+=this.x_veloc*frame_delta;this.y_pos+=this.y_veloc*frame_delta;this.x_veloc*=this.friction;this.y_veloc*=this.friction}function draw_cell(ctx,cam,shadow,player_radius){if(this.dead)return;if(shadow){ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.arc(cam.world_to_viewport_x(this.x_pos)+1,cam.world_to_viewport_y(this.y_pos)+3,this.radius*cam.scale,0,Math.PI*2,true);ctx.closePath();ctx.fill()}if(player_radius){if(this.radius>player_radius)ctx.fillStyle="rgb(255,68,26)";else if(player_radius-this.radius<=4){var delta=player_radius-this.radius;if(delta<=2){var ref=[[255,255],[68,175],[26,0]];ctx.fillStyle="rgb("+ref.map(x=>x[0]+(x[1]-x[0])*delta/4).join(",")+")"}else{delta-=2;var ref=[[255,54],[175,182],[0,255]];ctx.fillStyle="rgb("+ref.map(x=>x[0]+(x[1]-x[0])*delta/4).join(",")+")"}}else ctx.fillStyle="rgb(54,182,255)"}else ctx.fillStyle=this.fillStyle;ctx.beginPath();ctx.arc(cam.world_to_viewport_x(this.x_pos),cam.world_to_viewport_y(this.y_pos),this.radius*cam.scale,0,Math.PI*2,true);ctx.closePath();ctx.fill()}module.exports=Cell},{"../config.json":2}],5:[function(require,module,exports){module.exports=function(songArray,sfxDict){this.default_volume=.6;this.songs=songArray;this.sounds=sfxDict;this.asset_dir="sounds/";this.inited=false;this.song_volume=this.default_volume;this.current_song=0;this.song_audio=null;this.muted=false;this.init=function(){this.current_song=Math.floor(Math.random()*songArray.length);this.load_song();this.inited=true;for(var i in this.sounds){var src=this.sounds[i][0];this.sounds[i].push([new Audio(this.asset_dir+src),new Audio(this.asset_dir+src)]);this.sounds[i].push(0)}};this.load_song=function(){if(this.songs.length>this.current_song){if(this.song_audio){this.song_audio.pause();this.song_audio=null}this.song_audio=new Audio(this.asset_dir+this.songs[this.current_song][0]);this.song_audio.volume=this.default_volume;this.song_audio.addEventListener("ended",function(){world.music.next_song()},false);var infobox=document.getElementById("songinfo");var titlebox=document.getElementById("songtitle");var artistbox=document.getElementById("songartist");if(infobox&&titlebox&&artistbox){titlebox.innerText=this.songs[this.current_song][1];artistbox.innerText=this.songs[this.current_song][2];infobox.className="featured";setTimeout(function(){document.getElementById("songinfo").className="idle"},2e3)}}};this.next_song=function(){this.current_song=(this.current_song+1)%this.songs.length;this.load_song();this.play_song()};this.play_song=function(){if(this.song_audio&&!this.muted){this.song_audio.play()}};this.pause_song=function(){if(this.song_audio&&!this.muted){this.song_audio.pause()}};this.play_pause_song=function(){if(this.song_audio){}};this.lower_volume=function(){this.song_volume=.2};this.raise_volume=function(){this.song_volume=.6};this.mute=function(){if(!this.muted){this.song_audio.pause();this.muted=true;document.getElementById("mute").children[0].className="fas fa-2x fa-volume-mute";document.getElementById("mute").children[1].innerText="Unmute sounds [M]"}else{this.song_audio.play();this.muted=false;document.getElementById("mute").children[0].className="fas fa-2x fa-volume-up";document.getElementById("mute").children[1].innerText="Mute sounds [M]"}};this.play_sound=function(name){if(!this.muted){var sound=this.sounds[name];if(sound){sound[1][sound[2]].play();sound[2]=(sound[2]+1)%sound[1].length}}};this.update=function(){if(this.song_audio.volume!=this.song_volume)this.song_audio.volume+=(this.song_volume-this.song_audio.volume)*.1}}},{}],6:[function(require,module,exports){var Camera=require("./camera");var config=require("../config.json");function Renderer(canvas){this.level_radius=config.consts.LEVEL_RADIUS;this.canvas=canvas;this.ctx=this.canvas.getContext("2d");this.cam=new Camera(canvas);this.shadows=true;this.init=function(){this.canvas.addEventListener("touchstart",this.touch_start,false);this.canvas.addEventListener("mousedown",this.mouse_down,false);this.canvas.addEventListener("DOMMouseScroll",this.mouse_scroll,false);this.canvas.addEventListener("mousewheel",this.mouse_scroll,false)};this.click_at_point=function(x,y){if(!world.paused){x=this.cam.viewport_to_world_x(x);y=this.cam.viewport_to_world_y(y);world.push_player_from(x,y)}};this.touch_start=function(ev){ev.preventDefault();var touch=ev.touches[0];world.renderer.click_at_point(touch.pageX,touch.pageY)};this.mouse_down=function(ev){ev.preventDefault();if(ev.layerX||ev.layerX==0){ev._x=ev.layerX;ev._y=ev.layerY}else if(ev.offsetX||ev.offsetX==0){ev._x=ev.offsetX;ev._y=ev.offsetY}world.renderer.click_at_point(ev._x,ev._y)};this.mouse_scroll=function(event){var delta=0;if(!event)event=window.event;if(event.wheelDelta){delta=event.wheelDelta/60}else if(event.detail){delta=-event.detail/2}delta=delta/Math.abs(delta);if(delta!=0){world.user_did_zoom=true;if(delta>0)world.renderer.cam.scale_target*=1.2;if(delta<0)world.renderer.cam.scale_target/=1.2;var fit=Math.min(world.renderer.canvas.width,world.renderer.canvas.height);var max=fit/4/world.get_player().radius;var min=fit/4/world.renderer.level_radius;if(world.renderer.cam.scale_target>max)world.renderer.cam.scale_target=max;if(world.renderer.cam.scale_target<min)world.renderer.cam.scale_target=min}};this.key_down=function(e){var code;if(!e)var e=window.event;if(e.keyCode)code=e.keyCode;else if(e.which)code=e.which;switch(code){case 72:world.toggle_help();break;case 77:world.music.mute();break;case 78:world.music.next_song();break;case 80:world.pause();break;case 82:world.load_level();break;case 83:world.shadows=!world.shadows;break}};this.update=function(){this.canvas.height=window.innerHeight;this.canvas.width=window.innerWidth;this.ctx.fillStyle="#1D40B5";this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);this.ctx.beginPath();this.ctx.rect(0,0,this.canvas.width,this.canvas.height);this.ctx.closePath();this.ctx.fill();this.ctx.fillStyle="#2450E4";this.ctx.beginPath();this.ctx.arc(this.cam.world_to_viewport_x(0),this.cam.world_to_viewport_y(0),Math.abs(this.level_radius*this.cam.scale),0,Math.PI*2,true);this.ctx.closePath();this.ctx.fill();if(this.shadows){this.ctx.strokeStyle="rgba(0,0,0,0.3)";this.ctx.lineWidth=2;this.ctx.beginPath();this.ctx.arc(this.cam.world_to_viewport_x(0)+2,this.cam.world_to_viewport_y(0)+4,this.level_radius*this.cam.scale,0,Math.PI*2,true);this.ctx.closePath();this.ctx.stroke()}this.ctx.strokeStyle="#FFF";this.ctx.lineWidth=2;this.ctx.beginPath();this.ctx.arc(this.cam.world_to_viewport_x(0),this.cam.world_to_viewport_y(0),this.level_radius*this.cam.scale,0,Math.PI*2,true);this.ctx.closePath();this.ctx.stroke();var player=world.get_player();for(var i=0;i<world.cells.length;i++){if(i!=0){world.cells[i].draw(this.ctx,this.cam,this.shadows,player.radius)}}this.cam.update(player.x_pos,player.y_pos,world.frame_delta);player.draw(this.ctx,this.cam,this.shadows)};this.init()}module.exports=Renderer},{"../config.json":2,"./camera":3}],7:[function(require,module,exports){var MusicPlayer=require("./musicplayer");var Cell=require("./cell");var Renderer=require("./renderer");var config=require("../config.json");function World(canvas){this.level_radius=config.consts.LEVEL_RADIUS;this.cells=[];this.lastTick=(new Date).getTime();this.frame_spacing;this.frame_delta;this.won=false;this.user_did_zoom=false;this.paused=false;this.has_started=false;this.renderer=new Renderer(canvas);this.music=new MusicPlayer([["music/Pitx_-_Black_Rainbow.ogg","Black Rainbow","Pitx"],["music/rewob_-_Circles.ogg","Circles","rewob"],["music/FromSummertoWinter-Ghidorah.mp3","From Summer to Winter","Ghidorah"],["music/Biosphere-Antennaria.ogg","Biosphere","Antennaria"],["music/JulienNeto-FromCoverToCover.ogg","FromCoverToCover","Julien Neto"],["music/VincentAndTristan_OsmosTheme1.ogg","Osmos Theme 1","Vincent And Tristan"],["music/VincentAndTristan_OsmosTheme2.ogg","Osmos Theme 2","Vincent And Tristan"],["music/HighSkies-ShapeOfThingsToCome.ogg","Shape Of Things To Come","High Skies"],["music/Loscil-Rorschach.ogg","Rorschach","Loscil"]],{blip:["fx/blip.ogg"],win:["fx/win.ogg"],death:["fx/death.ogg"],bounce:["fx/bounce.ogg"]});this.init=function(){window.addEventListener("keydown",this.key_down,false);window.addEventListener("blur",function(){world.pause(true)},false);document.getElementById("mute").addEventListener("click",function(){world.music.mute()},false);document.getElementById("newlevel").addEventListener("click",function(){world.load_level()},false);document.getElementById("pause").addEventListener("click",function(){world.pause()},false);document.getElementById("help").addEventListener("click",function(){world.toggle_help()},false);document.getElementById("messages").addEventListener("click",function(){switch(document.getElementById("messages").className){case"paused":world.pause();break;case"death":case"warning":case"success":world.load_level();break;default:break}},false);document.getElementById("playbutton").addEventListener("click",function(){world.toggle_help();world.music.play_sound("win")},false);this.music.init()};this.show_message=function(id){this.clear_msgs(true);var div=document.getElementById("messages");div.className=id;div.style.display="block";var content;switch(id){case"paused":content="<p>Paused</p><p>Click here to resume playing.</p>";break;case"death":content="<p>You were consumed!</p><p>Click here to restart the level.</p>";break;case"warning":content="<p>Uhhhhh.</p><p>You may just wanna click here to restart the level.</p>";break;case"success":content="<p>Good!</p><p>Click here to start another random level.</p>";break;default:content="";break}div.innerHTML=content};this.clear_msgs=function(forceclear){document.getElementById("messages").style.display="none";if(!forceclear){if(this.won)this.show_message("success");else if(this.get_player()&&this.get_player().dead)this.show_message("death")}};this.toggle_help=function(){var overlay=document.getElementById("helpoverlay");if(overlay.style.display=="none"){this.pause(true);overlay.style.display="block"}else{this.pause();overlay.style.display="none"}};this.pause=function(forcepause){if(this.paused&&!forcepause){this.clear_msgs();this.paused=false;document.getElementById("pause").children[0].className="fas fa-2x fa-pause";document.getElementById("pause").children[1].innerText="Pause [P]";this.music.raise_volume()}else{this.show_message("paused");this.paused=true;document.getElementById("pause").children[0].className="fas fa-2x fa-play";document.getElementById("pause").children[1].innerText="Play [P]";this.music.lower_volume()}};this.load_level=function(){this.cells=[];this.user_did_zoom=false;this.won=false;this.clear_msgs();this.cells.push(new Cell(0,0,30));var rad,ang,r,x,y,cell;for(var i=0;i<config.consts.NUM_CELLS;i++){if(i<4)rad=5+Math.random()*5;else if(i<6)rad=40+Math.random()*15;else rad=7+Math.random()*35;ang=Math.random()*2*Math.PI;r=Math.random()*(this.level_radius-20-rad-rad);x=(30+rad+r)*Math.sin(ang);y=(30+rad+r)*Math.cos(ang);cell=new Cell(x,y,rad);cell.x_veloc=(Math.random()-.5)*.35;cell.y_veloc=(Math.random()-.5)*.35;this.cells.push(cell)}this.renderer.cam.center()};this.get_player=function(){if(this.cells.length>0)return this.cells[0]};this.push_player_from=function(x,y){var player=this.get_player();if(player&&!player.dead){var dx=player.x_pos-x;var dy=player.y_pos-y;var mag=Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));dx/=mag;dy/=mag;var area=player.area();var fx=dx*(5/9);var fy=dy*(5/9);player.x_veloc+=fx;player.y_veloc+=fy;var expense=area/25/(2*Math.PI*player.radius);player.radius-=expense;var newrad=Math.sqrt(area/20/Math.PI);var newx=player.x_pos-dx*(player.radius+newrad+1);var newy=player.y_pos-dy*(player.radius+newrad+1);var newcell=new Cell(newx,newy,newrad);newcell.x_veloc=-fx*9;newcell.y_veloc=-fy*9;this.cells.push(newcell);this.music.play_sound("blip")}};this.transfer_mass=function(cell1,cell2){var player=this.get_player();var bigger=cell1;var smaller=cell2;if(cell2.radius>cell1.radius){bigger=cell2;smaller=cell1}var overlap=(cell1.radius+cell2.radius-cell1.distance_from(cell2))/(2*smaller.radius);if(overlap>1)overlap=1;overlap*=overlap;var mass_exchange=overlap*smaller.area()*this.frame_delta;smaller.radius-=mass_exchange/(2*Math.PI*smaller.radius);bigger.radius+=mass_exchange/(2*Math.PI*bigger.radius);if(bigger===player&&!this.user_did_zoom){this.renderer.cam.zoom_to_player()}if(smaller.radius<=1){smaller.dead=true;if(smaller===player)this.player_did_die()}};this.player_did_die=function(){this.music.play_sound("death");this.show_message("death");var player=this.get_player();player.x_pos=player.y_pos=0;for(var i=1;i<this.cells.length;i++){var cell=this.cells[i];if(!cell.dead){cell.x_veloc+=(cell.x_pos-player.x_pos)/50;cell.y_veloc+=(cell.y_pos-player.y_pos)/50}}};this.player_did_win=function(){if(!this.won){this.won=true;this.music.play_sound("win");this.show_message("success")}};this.update=function(){var player=this.get_player();var currentTick=(new Date).getTime();this.frame_spacing=currentTick-this.lastTick;this.frame_delta=this.frame_spacing*config.fps/1e3;this.lastTick=currentTick;var smallest_big_mass=9999999999,total_usable_mass=0,curr_area;for(var i=0;i<this.cells.length;i++){if(this.cells[i].dead)continue;if(!this.paused){for(var j=0;j<this.cells.length;j++){if(i!=j&&!this.cells[j].dead){if(this.cells[i].collides_with(this.cells[j])){this.transfer_mass(this.cells[i],this.cells[j])}}}this.cells[i].update(this.frame_delta);curr_area=this.cells[i].area();if(this.cells[i].radius>player.radius){if(curr_area<smallest_big_mass)smallest_big_mass=curr_area}else total_usable_mass+=curr_area;var cell_x=this.cells[i].x_pos,cell_y=this.cells[i].y_pos,cellrad=this.cells[i].radius,dist_from_origin=Math.sqrt(Math.pow(cell_x,2)+Math.pow(cell_y,2));if(dist_from_origin+cellrad>this.level_radius){var cell_xvel=this.cells[i].x_veloc,cell_yvel=this.cells[i].y_veloc;this.cells[i].x_pos*=(this.level_radius-cellrad-1)/dist_from_origin;this.cells[i].y_pos*=(this.level_radius-cellrad-1)/dist_from_origin;cell_x=this.cells[i].x_pos;cell_y=this.cells[i].y_pos;dist_from_origin=Math.sqrt(Math.pow(cell_x,2)+Math.pow(cell_y,2));var cell_speed=Math.sqrt(Math.pow(cell_xvel,2)+Math.pow(cell_yvel,2));var angle_from_origin=angleForVector(cell_x,cell_y);var veloc_ang=angleForVector(cell_xvel,cell_yvel);var new_veloc_ang=Math.PI+angle_from_origin+(angle_from_origin-veloc_ang);var center_to_cell_norm_x=-cell_x*(1/dist_from_origin);var center_to_cell_norm_y=-cell_y*(1/dist_from_origin);this.cells[i].x_veloc=cell_speed*Math.cos(new_veloc_ang);this.cells[i].y_veloc=cell_speed*Math.sin(new_veloc_ang);if(i==0)this.music.play_sound("bounce")}}}if(!player.dead&&!this.paused&&!this.won){if(smallest_big_mass==9999999999){this.player_did_win()}else if(total_usable_mass<smallest_big_mass){this.show_message("warning")}}this.music.update();this.renderer.update()};this.init()}function angleForVector(x,y){var ang=Math.atan(y/x);if(x<0)ang+=Math.PI;else if(y<0)ang+=2*Math.PI;return ang}module.exports=World},{"../config.json":2,"./cell":4,"./musicplayer":5,"./renderer":6}]},{},[1]);