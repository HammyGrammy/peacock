/*
-----------------------------------
Properties to store for each object
-----------------------------------

what we're storing (name of object property)

Physics
	speed 			(speed.x/y/r)
	position		(pos.x/y/r)
	mass			(M)
	area			(A)
	inertia			(I)
	enthalpy		(Q)
	electroneg		(V)
	restitution     (E)
	impulses		(impulse)[i]
	
Graphics
	base vertices 	(bPoint.x/y)
	current vertices(point.x/y)
	colour			(colour.current/base)
	maximum radius 	(maxRad)
*/

/*
Goal for physics library - Pass objects in, get impulses out

-------------------------------
short term - impulse resolution
-------------------------------

Collisions
	(check) point in poly
	(reaction) moment of inertia/area, mass and velocities
	return the impulse and direction vector so we can resolve the other forces
	restitution

ropes and cables
	tension calculator (use impulses, not forces)
	how do bodies joined by a cable rotate?
	
deformation and splitting
	sound effects
	decide the split path
	absorbs some impulse????
	
explosions
	ray casting algorithm (force decays with distance)
	orthogonal component of cast rays	
	
gravity
	classical mechanics for attractive forces
	maybe passive attraction between everything?
	Gravity wells are the only attractive objects
	Fields needn't be circular, they could be normal to closest surface	

propulsion
	subset of explosions???
	constant linear force	
		
* Remember that all constant forces are pulsed at a 1 frame interval

--------------------
Freaky Stretch goals
--------------------

light
	force due to light???
	heating due to light???
	radiation???
	scattering and refelecting light (ray tracing)
	

electricity
	determine electric potentials from dissimilar materials
	account for effects of electrolyte
	
thermal
	conduction of heat
	radiation
	change of state (could exert forces???)
	expansion (could exert forces???)
	
---------------------------
do these things every frame
---------------------------

	1) resolve all the impulses
	2) resolve the deformations to decrease impulses
	3) then find changes in velocity and angular velocity
	4) calculate movements
*/