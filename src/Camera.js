class Camera {
    constructor() {
        this.fov = 60;
        this.eye =  new Vector3([0, 0.6, -3]);
        this.at =   new Vector3([0, 0, 100]);
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
        // vector delta with origin g_eye and end g_at, d.normalize() -> eye += delta, at += delta
        // delta = at - eye
        var delta = new Vector3(0, 0, 0);
        delta = this.at - this.eye;
        delta = delta.normalize();



    }

    m_backward() {

    }

    m_left() {

    }

    m_right() {

    }
}