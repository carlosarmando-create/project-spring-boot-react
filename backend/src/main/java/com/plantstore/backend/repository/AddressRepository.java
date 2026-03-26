package com.plantstore.backend.repository;

import com.plantstore.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserIdOrderByPrimaryAddressDescCreatedAtDesc(Long userId);
}
