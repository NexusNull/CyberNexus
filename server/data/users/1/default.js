let kitePoint ={x:-355,y:-1295}
timeToOrbit = 6

function kite() {
	let time = (((new Date()).getTime()) % ((timeToOrbit) * 1000)) / (timeToOrbit * 1000) * 2;
    let radius = ((character.speed + 2) * timeToOrbit) / (2 * Math.PI);
    move(kitePoint.x + Math.sin(Math.PI * time) * radius, kitePoint.y + Math.cos(Math.PI * time) * radius)
}

setInterval(function(){
  kite();
},250);

setInterval(function(){

	use_hp_or_mp();
	
	var target=get_targeted_monster();
	if(!target)
	{
		target=get_nearest_monster({min_xp:100,max_att:10200});
		if(target) change_target(target);

	}
	loot();
 	if(can_attack(target))
	{
		set_message("Attacking");
		attack(target);

	}

},1000/4);
var a = "asdasdasdasd";