<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn_version;
use cenozo\lib, cenozo\log, magnolia\util;

class patch extends \cenozo\service\patch
{
  /**
   * Extend parent method
   */
  public function validate()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    parent::validate();

    // If we're setting the new user make sure there isn't another active amendment with the same graduate
    // which is changing to a different user
    $data = $this->get_file_as_array();
    if( array_key_exists( 'new_user_id', $data ) && !is_null( $data['new_user_id'] ) )
    {
      $db_reqn = $this->get_leaf_record()->get_reqn();

      $reqn_sel = lib::create( 'database\select' );
      $reqn_sel->add_column( 'identifier' );
      $reqn_sel->add_table_column( 'user', 'first_name' );
      $reqn_sel->add_table_column( 'user', 'last_name' );

      $reqn_mod = lib::create( 'database\modifier' );
      $reqn_mod->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
      $reqn_mod->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
      $reqn_mod->join( 'user', 'reqn_version.new_user_id', 'user.id' );
      $reqn_mod->join( 'reqn_version_has_amendment_type', 'reqn_version.id', 'reqn_version_has_amendment_type.reqn_version_id' );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'reqn_version_has_amendment_type.amendment_type_id', '=', 'amendment_type.id', false );
      $join_mod->where( 'amendment_type.new_user', '=', true );
      $reqn_mod->join_modifier( 'amendment_type', $join_mod, 'left' );

      $reqn_mod->where( 'reqn.id', '!=', $db_reqn->id );
      $reqn_mod->where( 'reqn.graduate_id', '=', $db_reqn->graduate_id );
      $reqn_mod->where( 'reqn_version.new_user_id', '!=', $data['new_user_id'] );

      $reqn_list = $reqn_class_name::select( $reqn_sel, $reqn_mod );
      if( 0 < count( $reqn_list ) )
      {
        $other_reqn = current( $reqn_list );
        $identifier = $other_reqn['identifier'];
        $db_user = lib::create( 'database\user', $data['new_user_id'] );
        $db_graduate_user = $db_reqn->get_graduate_user();
        $graduate = sprintf( '%s %s', $db_graduate_user->first_name, $db_graduate_user->last_name );
        $this_user = sprintf( '%s %s', $db_user->first_name, $db_user->last_name );
        $other_user = sprintf( '%s %s', $other_reqn['first_name'], $other_reqn['last_name'] );

        throw lib::create( 'exception\notice', sprintf(
          'You cannot change the primary applicant to %s because there is already an active amendment to change the primary '.
          'applicant for requisition %s to %s.%sSince that requisition has the same trainee as this requisition, %s, both '.
          'amendments must transfer ownership to the same owner. You must either select %s as the new primary applicant for '.
          'this requisition or change the new primary applicant for requistion %s.',
          $this_user,
          $identifier,
          $other_user,
          "\n\n",
          $graduate,
          $other_user,
          $identifier
        ), __METHOD__ );
      }
    }
  }

  /**
   * Extend parent method
   */
  public function execute()
  {
    parent::execute();

    $db_reqn_version = $this->get_leaf_record();
    $file = $this->get_argument( 'file', NULL );
    $headers = apache_request_headers();
    if( false !== strpos( $headers['Content-Type'], 'application/octet-stream' ) && !is_null( $file ) )
    {
      $filename = $db_reqn_version->get_filename( str_replace( '_filename', '', $file ) );
      if( false === file_put_contents( $filename, $this->get_file_as_raw() ) )
        throw lib::create( 'exception\runtime',
          sprintf( 'Unable to write file "%s"', $filename ),
          __METHOD__ );
    }
  }
}
