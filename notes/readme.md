# Idea for points for red star done
```base = star life time ms / 6000```
```base_multiplayer = x1```
```rs/drs bonus = +0.35/+0.75```

----
(base_reward+(rs_points\*0.1))\*(base_multiplayer+0.rs_lvl+dark_redstar multiplayer) = custom reputation scoring
----


- Example for rs6 no rs event 900000 ms (15 mins) star life time

```((900000/6000)+(0*0.1))*(1+0.6+0.35) = 292.5```

Message to user
```
For your contribution during the last rs or drs mission
Our federation gives you the following reward x {economy_points_name}

From the mathematical formula:
- Star Lifespan Points:
(ms/6000) = result
- RS Event Bonus:
(score\*0.1) = result

- Final points:
(life_time+rs_event)

- Multipliers:
-# (base+rs_lvl+type\_bonus)
x(x¹+x²+x³)

```









------

Use functions to common things like
Logs webhook, user id to icon url
etc
