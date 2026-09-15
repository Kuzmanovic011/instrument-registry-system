package rs.pupin.evmer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import rs.pupin.evmer.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long>, JpaSpecificationExecutor<User> {

        User findByUsername(String username);
        Optional<User> findByIdAndActiveTrue(Long id);
        boolean existsByUsername(String username);
        boolean existsByEmail(String email);
        boolean existsByEmailAndIdNot(String email, Long id);
        boolean existsByUsernameAndIdNot(String email, Long id);
}
