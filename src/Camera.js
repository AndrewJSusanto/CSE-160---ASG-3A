class Camera {
    constructor() {
        this.fov = 60;
        this.eye =  new Vector3([-14, 0.6, -14]);
        this.at =   new Vector3([14, 0.6, -14]);
        this.up =   new Vector3([0, 1, 0]);

        this.projMat = new Matrix4();
        this.projMat.setPerspective(
            this.fov, canvas.width / canvas.height, 0.1, 100
        );

        this.viewMat = new Matrix4();
        this.viewMat.setLookAt(
            this.eye.elements[0],    this.eye.elements[1],    this.eye.elements[2],
            this.at.elements[0],     this.at.elements[1],     this.at.elements[2],
            this.up.elements[0],     this.up.elements[1],     this.up.elements[2]
        );

    }

    m_forward() {
        // vector delta with origin g_eye and end g_at (d = at - eye)
        // d.normalize() -> eye += delta, at += delta
        // lookAt to move eye
        var delta = new Vector3( [0, 0, 0] );
        delta.set(this.at);
        delta.sub(this.eye);
        delta = delta.normalize();
        this.eye    = this.eye.add(delta.mul(1));
        this.at     = this.at.add(delta.mul(1));
        
        this.viewMat.setLookAt(
            this.eye.elements[0],    this.eye.elements[1],    this.eye.elements[2],
            this.at.elements[0],     this.at.elements[1],     this.at.elements[2],
            this.up.elements[0],     this.up.elements[1],     this.up.elements[2]
        );
    }

    m_backward() {
        // same as forwards but minus delta
        var delta = new Vector3( [0, 0, 0] );
        delta.set(this.at);
        delta.sub(this.eye);
        delta = delta.normalize();
        this.eye    = this.eye.sub(delta.mul(1));
        this.at     = this.at.sub(delta.mul(1));

        this.viewMat.setLookAt(
            this.eye.elements[0],    this.eye.elements[1],    this.eye.elements[2],
            this.at.elements[0],     this.at.elements[1],     this.at.elements[2],
            this.up.elements[0],     this.up.elements[1],     this.up.elements[2]
        );
    }

    m_left() {
        // left is a resultant of the cross product of delta and up
        var res = new Vector3( [0, 0, 0] );
        var delta = new Vector3( [0, 0, 0] );
        delta.set(this.at);
        delta.sub(this.eye);
        delta.mul(-1);
        // res = delta x up
        res = Vector3.cross(delta, this.up).normalize();
        this.eye    = this.eye.add(res.mul(1));
        this.at     = this.at.add(res.mul(1));

        this.viewMat.setLookAt(
            this.eye.elements[0],    this.eye.elements[1],    this.eye.elements[2],
            this.at.elements[0],     this.at.elements[1],     this.at.elements[2],
            this.up.elements[0],     this.up.elements[1],     this.up.elements[2]
        );
    }

    m_right() {
        // right is a resultant of the cross product of -delta and up
        // can also be achieved through this.eye = this.eye.sub(...)
        var res = new Vector3( [0, 0, 0] );
        var delta = new Vector3( [0, 0, 0] );
        delta.set(this.at);
        delta.sub(this.eye);
        // delta -> -delta
        //delta.mul(-1);

        // res = -delta x up
        res = Vector3.cross(delta, this.up).normalize();
        this.eye    = this.eye.add(res.mul(1));
        this.at     = this.at.add(res.mul(1));

        this.viewMat.setLookAt(
            this.eye.elements[0],    this.eye.elements[1],    this.eye.elements[2],
            this.at.elements[0],     this.at.elements[1],     this.at.elements[2],
            this.up.elements[0],     this.up.elements[1],     this.up.elements[2]
        );
    }

    m_panLeft(deg) {
        var delta = new Vector3( [0, 0, 0] );
        var delta_prime = new Vector3( [0, 0, 0] );
        delta.set(this.at);
        delta.sub(this.eye);
        var rotMat = new Matrix4();

        // set angle of rotation
        //rotMat.setRotate(10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        rotMat.setRotate(-deg, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        // apply rotation by multiplying rotation matrix with initial vector delta
        delta_prime = rotMat.multiplyVector3(delta);
        var temp = new Vector3( [0, 0, 0] );
        temp.set(this.eye);
        this.at = temp.add(delta_prime);

        this.viewMat.setLookAt(
            this.eye.elements[0],    this.eye.elements[1],    this.eye.elements[2],
            this.at.elements[0],     this.at.elements[1],     this.at.elements[2],
            this.up.elements[0],     this.up.elements[1],     this.up.elements[2]
        );
    }

    m_panRight(deg) {
        var delta = new Vector3( [0, 0, 0] );
        var delta_prime = new Vector3( [0, 0, 0] );
        delta.set(this.at);
        delta.sub(this.eye);
        var rotMat = new Matrix4();

        // set angle of rotation
        //rotMat.setRotate(-10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        rotMat.setRotate(-deg, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        // apply rotation by multiplying rotation matrix with initial vector delta
        delta_prime = rotMat.multiplyVector3(delta);
        var temp = new Vector3( [0, 0, 0] );
        temp.set(this.eye);
        this.at = temp.add(delta_prime);

        this.viewMat.setLookAt(
            this.eye.elements[0],    this.eye.elements[1],    this.eye.elements[2],
            this.at.elements[0],     this.at.elements[1],     this.at.elements[2],
            this.up.elements[0],     this.up.elements[1],     this.up.elements[2]
        );
    }
}