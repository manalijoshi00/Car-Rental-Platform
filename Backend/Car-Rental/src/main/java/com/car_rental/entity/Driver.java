package com.car_rental.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "drivers") // Collection name in MongoDB
public class Driver {

    @Id
    private String driverId; // MongoDB uses String/ObjectId

    private String name;
    private String licenseNo;
    private String phone; // Better to store as String for formatting
    private String email;
    private String address;
    private String status;

    public Driver() {
		
		// TODO Auto-generated constructor stub
	}

	public Driver(String driverId, String name, String licenseNo, String phone, String email, String address,
                  String status) {
        this.driverId = driverId;
        this.name = name;
        this.licenseNo = licenseNo;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.status = status;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLicenseNo() {
        return licenseNo;
    }

    public void setLicenseNo(String licenseNo) {
        this.licenseNo = licenseNo;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
