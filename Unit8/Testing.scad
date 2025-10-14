outer_size = 40;
thickness = 5;
r = 4;
hole_d = 6;
hole_spacing = 20;
$fn = 64;

module rounded_plate() {
    minkowski() {
        cube([outer_size - 2*r, outer_size - 2*r, thickness], center = true);
        cylinder(r = r, h = 0.01, $fn = $fn);
    }
}

module plate_with_holes() {
    difference() {
        rounded_plate();
        translate([-hole_spacing/2, 0, -thickness])
            cylinder(d = hole_d, h = thickness * 3, $fn = $fn);
        translate([hole_spacing/2, 0, -thickness])
            cylinder(d = hole_d, h = thickness * 3, $fn = $fn);
    }
}

union() {
    // bottom arm
    translate([0, 0, thickness/2])
        plate_with_holes();

    // vertical arm (rotated and touching the bottom arm)
    translate([0, outer_size/2 - thickness/2, outer_size/2])
        rotate([-90, 0, 0])
        plate_with_holes();
}
