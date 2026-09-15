package rs.pupin.evmer.Specification;

import org.springframework.data.jpa.domain.Specification;
import rs.pupin.evmer.enums.UserRoles;
import rs.pupin.evmer.model.User;

public class UserSpecification {

    public static Specification<User> hasFirstName(String firstName){
        return (root,query,cb)-> {
            if(firstName==null || firstName.isBlank()){
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("firstName")),"%"+ firstName.toLowerCase() + "%"
            );
        };
    }

    public static Specification<User> hasLastName(String lastName){
        return (root,query,cb)-> {
            if(lastName==null || lastName.isBlank()){
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("lastName")),"%"+ lastName.toLowerCase() + "%"
            );
        };
    }

    public static Specification<User> hasUsername(String username){
        return (root,query,cb)-> {
            if(username==null || username.isBlank()){
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("username")),"%"+ username.toLowerCase() + "%"
            );
        };
    }

    public static Specification<User> hasEmail(String email){
        return (root,query,cb)-> {
            if(email==null || email.isBlank()){
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("email")),"%"+ email.toLowerCase() + "%"
            );
        };
    }

    public static Specification<User>hasRole(UserRoles role){
        return (root,query,cb)-> {
            if (role == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("role"),role);
        };
    }

    public static Specification<User> hasDepartment(String department){
        return (root,query,cb)-> {
            if(department==null || department.isBlank()){
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("department")),"%"+ department.toLowerCase() + "%"
            );
        };
    }
}
