<?php
/**
 * reqn.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * reqn: record
 */
class reqn_version extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    // delete files if peer-review or funding are not selected
    if( !$this->peer_review ) $this->peer_review_filename = NULL;

    if( 'yes' != $this->funding )
    {
      if( 'requested' != $this->funding )
      {
        $this->funding_agency = NULL;
        $this->grant_number = NULL;
      }
      $this->funding_filename = NULL;
    }

    parent::save();

    // delete files if they are being set to null
    if( is_null( $this->coapplicant_agreement_filename ) )
    {
      $filename = $this->get_filename( 'coapplicant_agreement' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->peer_review_filename ) )
    {
      $filename = $this->get_filename( 'peer_review' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->funding_filename ) )
    {
      $filename = $this->get_filename( 'funding' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->ethics_filename ) )
    {
      $filename = $this->get_filename( 'ethics' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->data_sharing_filename ) )
    {
      $filename = $this->get_filename( 'data_sharing' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->agreement_filename ) )
    {
      $filename = $this->get_filename( 'agreement' );
      if( file_exists( $filename ) ) unlink( $filename );
    }

    // if this is the current reqn then we may need to change the parent reqn's data_sharing_approved bit
    $db_reqn = $this->get_reqn();
    if( $db_reqn->get_current_reqn_version()->id == $this->id )
    {
      // no data sharing file means data_sharing_approved can't be answered
      if( is_null( $this->data_sharing_filename ) ) $db_reqn->data_sharing_approved = NULL;
      // if there is a data sharing file then make sure approval is possible
      else if( is_null( $db_reqn->data_sharing_approved ) ) $db_reqn->data_sharing_approved = false;
      $db_reqn->save();
    }
  }

  /**
   * Override the parent method
   */
  public function delete()
  {
    $file_list = array();
    if( !is_null( $this->coapplicant_agreement_filename ) ) $file_list[] = $this->get_filename( 'coapplicant_agreement' );
    if( !is_null( $this->peer_review_filename ) ) $file_list[] = $this->get_filename( 'peer_review' );
    if( !is_null( $this->funding_filename ) ) $file_list[] = $this->get_filename( 'funding' );
    if( !is_null( $this->ethics_filename ) ) $file_list[] = $this->get_filename( 'ethics' );
    if( !is_null( $this->data_sharing_filename ) ) $file_list[] = $this->get_filename( 'data_sharing' );
    if( !is_null( $this->agreement_filename ) ) $file_list[] = $this->get_filename( 'agreement' );

    parent::delete();

    foreach( $file_list as $file ) if( file_exists( $file ) ) unlink( $file );
  }

  /**
   * Returns the amendment and version number of the reqn version (1, 2, 3, A1, A2, A3, B1, B2, B3, etc)
   * @return string
   */
  public function get_amendment_version()
  {
    return sprintf( '%s%s', '.' == $this->amendment ? '' : $this->amendment, $this->version );
  }

  /**
   * Determines whether there is any difference between this version and the last
   */
  public function has_changed()
  {
    $coapplicant_class_name = lib::get_class_name( 'database\coapplicant' );
    $reference_class_name = lib::get_class_name( 'database\reference' );
    $reqn_version_comment_class_name = lib::get_class_name( 'database\reqn_version_comment' );
    $data_justification_class_name = lib::get_class_name( 'database\data_justification' );

    // get the two newest versions
    $version_mod = lib::create( 'database\modifier' );
    $version_mod->where( 'reqn_id', '=', $this->reqn_id );
    $version_mod->order( 'amendment', true );
    $version_mod->order( 'version', true );
    $version_mod->limit( 2 );
    $reqn_version_list = static::select_objects( $version_mod );
    if( 2 != count( $reqn_version_list ) ) return true;

    $db_last_reqn_version = $reqn_version_list[1];

    // check all column values except for id, version, datetime and timestamps
    $ignore_columns = array( 'id', 'amendment', 'version', 'datetime', 'update_timestamp', 'create_timestamp' );
    foreach( $this->get_column_names() as $column )
      if( !in_array( $column, $ignore_columns ) && $this->$column != $db_last_reqn_version->$column )
        return true;

    // now check coapplicant records
    foreach( $this->get_coapplicant_object_list() as $db_coapplicant )
    {
      $db_last_coapplicant = $coapplicant_class_name::get_unique_record(
        array( 'reqn_version_id', 'name' ),
        array( $db_last_reqn_version->id, $db_coapplicant->name )
      );
      if( is_null( $db_last_coapplicant ) ) return true;

      // check all column values except for id, reqn_version_id and timestamps
      $ignore_columns = array( 'id', 'reqn_version_id', 'update_timestamp', 'create_timestamp' );
      foreach( $db_coapplicant->get_column_names() as $column )
        if( !in_array( $column, $ignore_columns ) && $db_coapplicant->$column != $db_last_coapplicant->$column )
          return true;
    }

    // now check reference records
    foreach( $this->get_reference_object_list() as $db_reference )
    {
      $db_last_reference = $reference_class_name::get_unique_record(
        array( 'reqn_version_id', 'rank' ),
        array( $db_last_reqn_version->id, $db_reference->rank )
      );
      if( is_null( $db_last_reference ) ) return true;

      // check all column values except for id, reqn_version_id and timestamps
      $ignore_columns = array( 'id', 'reqn_version_id', 'update_timestamp', 'create_timestamp' );
      foreach( $db_reference->get_column_names() as $column )
        if( !in_array( $column, $ignore_columns ) && $db_reference->$column != $db_last_reference->$column )
          return true;
    }

    // see if there is a different number of data selections
    if( $this->get_data_selection_count() != $db_last_reqn_version->get_data_selection_count() )
      return true;

    // now check each data_selection
    $data_selection_sel = lib::create( 'database\select' );
    $data_selection_sel->add_column( 'id' );
    $data_selection_id_list = array();
    foreach( $this->get_data_selection_list( $data_selection_sel ) as $data_selection )
      $data_selection_id_list[] = $data_selection['id'];
    sort( $data_selection_id_list );

    $last_data_selection_id_list = array();
    foreach( $db_last_reqn_version->get_data_selection_list( $data_selection_sel ) as $data_selection )
      $last_data_selection_id_list[] = $data_selection['id'];
    sort( $last_data_selection_id_list );

    foreach( $data_selection_id_list as $index => $id )
      if( $id != $last_data_selection_id_list[$index] ) return true;

    // check comments
    foreach( $this->get_reqn_version_comment_object_list() as $db_reqn_version_comment )
    {
      $db_last_reqn_version_comment = $reqn_version_comment_class_name::get_unique_record(
        array( 'reqn_version_id', 'data_category_id' ),
        array( $db_last_reqn_version->id, $db_reqn_version_comment->data_category_id )
      );
      if( $db_reqn_version_comment->description != $db_last_reqn_version_comment->description ) return true;
    }

    // see if there is a different number of justifications
    if( $this->get_data_justification_count() != $db_last_reqn_version->get_data_justification_count() )
      return true;

    // now check data_justification records
    foreach( $this->get_data_justification_object_list() as $db_rvj )
    {
      $db_last_rvj = $data_justification_class_name::get_unique_record(
        array( 'reqn_version_id', 'data_option_id' ),
        array( $db_last_reqn_version->id, $db_rvj->data_option_id )
      );
      if( is_null( $db_last_rvj ) ) return true;

      // check that the description matches
      if( $db_rvj->description != $db_last_rvj->description ) return true;
    }

    // do the same check but from the last version instead
    foreach( $db_last_reqn_version->get_data_justification_object_list() as $db_last_rvj )
    {
      $db_rvj = $data_justification_class_name::get_unique_record(
        array( 'reqn_version_id', 'data_option_id' ),
        array( $this->id, $db_last_rvj->data_option_id )
      );
      if( is_null( $db_rvj ) ) return true;

      // check that the description matches
      if( $db_rvj->description != $db_last_rvj->description ) return true;
    }

    // if we get here then everything is identical
    return false;
  }

  /**
   * Returns the path to various files associated with the reqn
   * 
   * @param string $type Should be 'agreement', 'coapplicant_agreement', 'peer_review', 'funding',
   *                     'ethics', 'data_sharing' or 'instruction'
   * @return string
   */
  public function get_filename( $type )
  {
    $directory = '';
    if( 'agreement' == $type ) $directory = AGREEMENT_LETTER_PATH;
    else if( 'coapplicant_agreement' == $type ) $directory = COAPPLICANT_AGREEMENT_PATH;
    else if( 'peer_review' == $type ) $directory = PEER_REVIEW_PATH;
    else if( 'funding' == $type ) $directory = FUNDING_LETTER_PATH;
    else if( 'ethics' == $type ) $directory = ETHICS_LETTER_PATH;
    else if( 'data_sharing' == $type ) $directory = DATA_SHARING_LETTER_PATH;
    else if( 'instruction' == $type ) $directory = INSTRUCTION_FILE_PATH;
    else throw lib::create( 'exception\argument', 'type', $type, __METHOD__ );
    return sprintf( '%s/%s', $directory, $this->id );
  }

  /**
   * Override parent method
   */
  public static function get_record_from_identifier( $identifier )
  {
    $util_class_name = lib::get_class_name( 'util' );
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    // convert reqn identifier to reqn_version_id (always using the current version)
    if( !$util_class_name::string_matches_int( $identifier ) && false === strpos( 'identifier=', $identifier ) )
    {
      $regex = '/identifier=(.+)/';
      $matches = array();
      if( preg_match( $regex, $identifier, $matches ) )
      {
        $db_reqn = $reqn_class_name::get_unique_record( 'identifier', $matches[1] );
        if( !is_null( $db_reqn ) ) $identifier = preg_replace( $regex, $db_reqn->get_current_reqn_version()->id, $identifier );
      }
    }

    return parent::get_record_from_identifier( $identifier );
  }

  /** 
   * Determines whether or not this reqn version has selected any Linked Data options
   * @return boolean
   */
  public function has_linked_data()
  {
    $select = lib::create( 'database\select' );
    $select->from( 'reqn_version' );
    $select->add_column( '0 < COUNT(*)', 'has_linked_data', false );
    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'reqn_version_has_data_selection', 'reqn_version.id', 'reqn_version_has_data_selection.reqn_version_id' );
    $modifier->join( 'data_selection', 'reqn_version_has_data_selection.data_selection_id', 'data_selection.id' );
    $modifier->join( 'data_option', 'data_selection.data_option_id', 'data_option.id' );
    $modifier->join( 'data_category', 'data_option.data_category_id', 'data_category.id' );
    $modifier->where( 'reqn_version.id', '=', $this->id );
    $modifier->where( 'data_category.name_en', '=', 'Linked Data' );

    return static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
  }

  /**
   * Returns the date that the reqn version was approved.
   * 
   * Note that this date will only be returned on the most recent version of an amendment and the date of the first
   * Decision Made stage is used for all reqn versions no matter if more recent Decision Made stages exist.  This is
   * because the first decision made stage refers to when the reqn was approved and future decision made stages refer
   * to when amendments were approved.
   * @return \DateTime
   */
  public function get_date_of_approval()
  {
    $db_reqn = $this->get_reqn();

    $date_of_approval = NULL;

    // first see if this is a catalyst grant
    if( 'Catalyst Grant' != $db_reqn->get_reqn_type()->name )
    {
      // get the date of the most recent reqn-version which is of the same amendment as the current reqn-version
      $reqn_version_mod = lib::create( 'database\modifier' );
      $reqn_version_mod->where( 'amendment', '=', $this->amendment );
      $reqn_version_mod->order_desc( 'version' );
      $reqn_version_mod->limit( 1 );
      $db_reqn_version = current( $db_reqn->get_reqn_version_object_list( $reqn_version_mod ) );

      // now find the most recent decision-made stage that comes after the reqn-version's datetime
      $stage_mod = lib::create( 'database\modifier' );
      $stage_mod->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
      $stage_mod->where( 'stage_type.name', '=', 'Decision Made' );
      $stage_mod->where( 'datetime', '>=', $db_reqn_version->datetime );
      $stage_mod->order( 'datetime' );
      $stage_mod->limit( 1 );

      $stage_list = $db_reqn->get_stage_object_list( $stage_mod );
      if( 0 < count( $stage_list ) ) $date_of_approval = current( $stage_list )->datetime;
    }

    return $date_of_approval;
  }

  /**
   * Returns a summary of all amendment justifications
   * 
   * Note that only justifications whose type is marked as "show_in_description" and which belong to the final
   * sub-version of each amendment.  Additionally, only amendments the same or older to the current one will
   * appear.
   * @param database\language $db_language The language to return the summary in (the reqn's if none is provided)
   * @return string
   */
  public function get_justification_summary( $db_language = NULL )
  {
    if( is_null( $db_language ) ) $db_language = $this->get_reqn()->get_language();
    $lang = $db_language->code;
    
    // create the query necessary to find the highest ranking version of all amendments
    $version_sel = lib::create( 'database\select' );
    $version_sel->from( 'reqn_version', 'latest_reqn_version' );
    $version_sel->add_column( 'MAX( version )', 'max_version', false );
    $version_mod = lib::create( 'database\modifier' );
    $version_mod->where( 'latest_reqn_version.reqn_id', '=', 'reqn_version.reqn_id', false );
    $version_mod->where( 'latest_reqn_version.amendment', '=', 'reqn_version.amendment', false );

    // create a temporary table with the final version of visible justifications for every amendment
    $select = lib::create( 'database\select' );
    $select->from( 'reqn_version' );
    $select->add_table_column( 'reqn_version', 'amendment' );
    $select->add_column(
      sprintf(
        'GROUP_CONCAT( '.
          'CONCAT( '.
            '\'"\', amendment_type.reason_%s, \'"\n\', '.
            'amendment_justification.description '.
          ') ORDER BY reqn_version.amendment, amendment_type.rank '.
          'SEPARATOR "\n\n" '.
        ')',
        $lang
      ),
      'description',
      false
    );
    $modifier = lib::create( 'database\modifier' );
    $modifier->join(
      'amendment_justification',
      'reqn_version.id',
      'amendment_justification.reqn_version_id'
    );
    $modifier->join(
      'amendment_type',
      'amendment_justification.amendment_type_id',
      'amendment_type.id'
    );
    $modifier->where( 'amendment_type.show_in_description', '=', true );
    $modifier->where(
      'reqn_version.version',
      '=',
      sprintf( '( %s%s )', $version_sel->get_sql(), $version_mod->get_sql() ),
      false
    );
    $modifier->where( 'reqn_version.reqn_id', '=', $this->reqn_id );
    $modifier->where( 'reqn_version.amendment', '<=', $this->amendment );
    $modifier->group( 'reqn_version.amendment' );

    $justification_list = $this->select( $select, $modifier );

    // now create the string by combining all of the justifications by amendment
    $first = true;
    $summary = '';
    foreach( $justification_list as $justification )
    {
      $summary .= sprintf(
        '%sAmendment "%s"%s%s',
        $first ? '' : "\n\n",
        $justification['amendment'],
        "\n\n",
        $justification['description']
      );

      $first = false;
    }

    return $summary;
  }

  /**
   * Calculate the cost of the reqn (NULL if show_prices is false)
   * 
   * Note: this process mirrors CnReqnVersionViewFactory::calculateCost() on the client-side
   * @return int
   */
  public function calculate_cost()
  {
    $db_reqn = $this->get_reqn();
    $base_country_id = lib::create( 'business\session' )->get_application()->country_id;
    $applicant_country_id = is_null( $this->applicant_country_id ) ? $base_country_id : $this->applicant_country_id;
    $trainee_country_id = is_null( $this->trainee_country_id ) ? $base_country_id : $this->trainee_country_id;
    $cost = 3000;

    // only calculate the cost if we have to
    if( !$db_reqn->show_prices ) return NULL;

    // cost for trainees is different to applicants
    if( $db_reqn->trainee_user_id ) {
      if( $base_country_id != $trainee_country_id || $base_country_id != $applicant_country_id ) {
        // if either the trainee or applicant isn't Canadian then the base fee is 5000
        $cost = 5000;
      } else if( $base_country_id == $trainee_country_id &&
                 $base_country_id == $applicant_country_id &&
                 !is_null( $this->waiver ) &&
                 'none' != $this->waiver ) {
        // if both are canadian and there is a fee waiver means the base cost is 0
        $cost = 0;
      }
    } else {
      // if the applicant is not Canadian then the base fee is 5000
      if( $base_country_id != $applicant_country_id ) $cost = 5000;
    }

    $selection_sel = lib::create( 'database\select' );
    $selection_sel->add_column( 'data_option_id' );
    $selection_sel->add_column( 'cost' );
    $selection_sel->add_column( 'cost_combined' );
    $selection_mod = lib::create( 'database\modifier' );
    $selection_mod->join( 'data_option', 'data_selection.data_option_id', 'data_option.id' );
    $selection_mod->join( 'data_category', 'data_option.data_category_id', 'data_category.id' );
    $selection_mod->where( 'data_selection.cost', '>', 0 );
    $selection_mod->order( 'data_category.rank' );
    $selection_mod->order( 'data_option.rank' );
    $current_data_option_id = NULL;
    $max_cost = 0;
    foreach( $this->get_data_selection_list( $selection_sel, $selection_mod ) as $selection )
    {
      if( $selection['data_option_id'] != $current_data_option_id )
      {
        // store the most expensive selection (if there is one)
        if( 0 < $max_cost ) $cost += $max_cost;
        $max_cost = 0;
      }

      if( $selection['cost_combined'] )
      {
        // track the most expensive selection
        if( $max_cost < $selection['cost'] ) $max_cost = $selection['cost'];
      }
      else $cost += $selection['cost'];

      $current_data_option_id = $selection['data_option_id'];
    }

    if( 0 < $max_cost ) $cost += $max_cost;

    return $cost;
  }

  /**
   * Generates the coapplicant agreement PDF form template
   */
  public function generate_coapplicant_agreement_template_form()
  {
    $pdf_form_type_class_name = lib::get_class_name( 'database\pdf_form_type' );
    $db_reqn = $this->get_reqn();
    $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Co-Applicant Agreement' );
    $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
    $agreement_filename = sprintf( '%s/coapplicant_agreement_template_%s.pdf', TEMP_PATH, $this->id );

    // generate the agreement file
    $data = array(
      'identifier' => $db_reqn->identifier,
      'version' => $this->get_amendment_version(),
      'date_of_download' => util::get_datetime_object()->format( 'Y-m-d' )
    );

    // get a list of all new coapplicants who have access to the data by first finding the last amendment-version
    $reqn_version_mod = lib::create( 'database\modifier' );
    $reqn_version_mod->where( 'amendment', '<', $this->amendment );
    $reqn_version_mod->order_desc( 'amendment' );
    $reqn_version_mod->order_desc( 'version' );
    $reqn_version_mod->limit( 1 );
    $reqn_version_list = $db_reqn->get_reqn_version_object_list( $reqn_version_mod );

    $last_coapplicant_list = array();
    if( 0 < count( $reqn_version_list ) )
    {
      $db_last_reqn_version = current( $reqn_version_list );
      $coapplicant_sel = lib::create( 'database\select' );
      $coapplicant_sel->add_column( 'name' );
      $coapplicant_sel->add_column( 'access' );
      foreach( $db_last_reqn_version->get_coapplicant_list( $coapplicant_sel ) as $coapplicant )
        $last_coapplicant_list[$coapplicant['name']] = $coapplicant['access'];
    }

    $coapplicant_number = 1;
    $coapplicant_sel = lib::create( 'database\select' );
    $coapplicant_sel->add_column( 'name' );
    $coapplicant_sel->add_column( 'affiliation' );
    $coapplicant_sel->add_column( 'email' );
    $coapplicant_sel->add_column( 'access' );
    $coapplicant_mod = lib::create( 'database\modifier' );
    $coapplicant_mod->where( 'access', '=', true ); // we only care about coapplicants with access
    foreach( $this->get_coapplicant_list( $coapplicant_sel, $coapplicant_mod ) as $coapplicant )
    {
      $add = false;

      // see if the coapplicant existing in the last version
      if( array_key_exists( $coapplicant['name'], $last_coapplicant_list ) )
      {
        // only add the coapplicant if they are newly being granted access to data
        if( !$last_coapplicant_list[$coapplicant['name']] ) $add = true;
      }
      else $add = true;

      if( $add )
      {
        $data[sprintf( 'name_%d', $coapplicant_number )] = $coapplicant['name'];
        $data[sprintf( 'affiliation_%d', $coapplicant_number )] = $coapplicant['affiliation'];
        $data[sprintf( 'email_%d', $coapplicant_number )] = $coapplicant['email'];
        $coapplicant_number++;
      }
    }

    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF coapplicant agreement template since there is no active PDF template.', __METHOD__ );

    $error = $db_pdf_form->fill_and_write_form( $data, $agreement_filename );
    if( $error )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $agreement_filename,
          $db_reqn->identifier,
          "\n".$error
        ),
        __METHOD__
      );
    }
  }

  /**
   * Generates all PDF forms of the reqn version (overwritting the previous versions)
   * 
   * This includes the application, checklist and application+checklist PDF files
   */
  public function generate_pdf_forms()
  {
    $pdf_form_type_class_name = lib::get_class_name( 'database\pdf_form_type' );
    $db_reqn = $this->get_reqn();
    $db_language = $db_reqn->get_language();
    $db_user = $db_reqn->get_user();
    $db_trainee_user = $db_reqn->get_trainee_user();
    $date_of_approval = $this->get_date_of_approval();
    $cost = $this->calculate_cost();

    // generate the application form
    $data = array(
      'identifier' => $db_reqn->identifier,
      'version' => $this->get_amendment_version(),
      'dateofapproval' => is_null( $date_of_approval ) ? 'None' : $date_of_approval->format( 'Y-m-d' ),
      'cost' => is_null( $cost )
        ? ( 'fr' == $db_language->code ? '(non calculé)' : '(not calculated)' )
        : sprintf( 'fr' == $db_language->code ? '%s $' : '$%s', $cost )
    );
    $data['applicant_name'] = sprintf( '%s %s', $db_user->first_name, $db_user->last_name );
    if( !is_null( $this->title ) ) $data['title'] = $this->title;

    $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Data Application' );
    $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
    $application_filename = sprintf( '%s/application_%s.pdf', TEMP_PATH, $this->id );

    if( !is_null( $this->applicant_position ) ) $data['applicant_position'] = $this->applicant_position;
    if( !is_null( $this->applicant_affiliation ) ) $data['applicant_affiliation'] = $this->applicant_affiliation;
    if( !is_null( $this->applicant_address ) ) $data['applicant_address'] = $this->applicant_address;
    if( !is_null( $this->applicant_phone ) ) $data['applicant_phone'] = $this->applicant_phone;
    $data['applicant_email'] = $db_user->email;
    // only show trainee details if there is a trainee user
    if( !is_null( $db_trainee_user ) )
    {
      $data['graduate_name'] = sprintf( '%s %s', $db_trainee_user->first_name, $db_trainee_user->last_name );
      if( !is_null( $this->trainee_program ) ) $data['graduate_program'] = $this->trainee_program;
      if( !is_null( $this->trainee_institution ) ) $data['graduate_institution'] = $this->trainee_institution;
      if( !is_null( $this->trainee_address ) ) $data['graduate_address'] = $this->trainee_address;
      if( !is_null( $this->trainee_phone ) ) $data['graduate_phone'] = $this->trainee_phone;
      if( !is_null( $db_trainee_user ) ) $data['graduate_email'] = $db_trainee_user->email;
      if( !is_null( $this->waiver ) )
      {
        if( 'graduate' == $this->waiver ) $data['waiver_graduate'] = 'Yes';
        else if( 'postdoc' == $this->waiver ) $data['waiver_postdoc'] = 'Yes';
        else if( 'clinical' == $this->waiver ) $data['waiver_clinical'] = 'Yes';
      }
    }
    if( !is_null( $this->start_date ) ) $data['start_date'] = $this->start_date->format( 'Y-m-d' );
    if( !is_null( $this->duration ) ) $data['duration'] = $this->duration;
    if( !is_null( $this->keywords ) ) $data['keywords'] = $this->keywords;
    if( !is_null( $this->lay_summary ) ) $data['lay_summary'] = $this->lay_summary;
    $data['word_count'] = is_null( $this->lay_summary ) ? 0 : count( explode( ' ', $this->lay_summary ) );
    if( !is_null( $this->background ) ) $data['background'] = $this->background;
    if( !is_null( $this->objectives ) ) $data['objectives'] = $this->objectives;
    if( !is_null( $this->methodology ) ) $data['methodology'] = $this->methodology;
    $data['amendment_justification'] = $this->get_justification_summary();
    if( !is_null( $this->analysis ) ) $data['analysis'] = $this->analysis;

    if( !is_null( $this->peer_review ) )
    {
      if( $this->peer_review ) $data['peer_review_yes'] = 'Yes';
      else $data['peer_review_no'] = 'Yes';
    }
    if( !is_null( $this->funding ) )
    {
      if( 'yes' == $this->funding ) $data['funding_yes'] = 'Yes';
      else if( 'no' == $this->funding ) $data['funding_no'] = 'Yes';
      else if( 'requested' == $this->funding ) $data['funding_requested'] = 'Yes';
    }
    if( !is_null( $this->funding_agency ) ) $data['funding_agency'] = $this->funding_agency;
    if( !is_null( $this->grant_number ) ) $data['grant_number'] = $this->grant_number;
    if( !is_null( $this->ethics ) ) $data['ethics'] = $this->ethics;
    $data['signature_applicant_name'] = $data['applicant_name'];

    foreach( $this->get_coapplicant_list() as $index => $coapplicant )
    {
      $data[sprintf( 'coapplicant%d_name', $index+1 )] = $coapplicant['name'];
      $data[sprintf( 'coapplicant%d_position', $index+1 )] =
        sprintf( "%s\n%s\n%s", $coapplicant['position'], $coapplicant['affiliation'], $coapplicant['email'] );
      $data[sprintf( 'coapplicant%d_role', $index+1 )] = $coapplicant['role'];
      $data[sprintf( 'coapplicant%d_%s', $index+1, $coapplicant['access'] ? 'yes' : 'no' )] = 'Yes';
    }

    $reference_list = array();
    $reference_sel = lib::create( 'database\select' );
    $reference_sel->add_column( 'rank' );
    $reference_sel->add_column( 'reference' );
    $reference_mod = lib::create( 'database\modifier' );
    $reference_mod->order( 'rank' );
    foreach( $this->get_reference_list( $reference_sel, $reference_mod ) as $reference )
      $reference_list[] = sprintf( '%s.  %s', $reference['rank'], $reference['reference'] );
    $data['references'] = implode( "\n", $reference_list );

    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF application form since there is no active PDF template.', __METHOD__ );

    $error = $db_pdf_form->fill_and_write_form( $data, $application_filename );
    if( $error )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $application_filename,
          $db_reqn->identifier,
          "\n".$error
        ),
        __METHOD__
      );
    }

    // now generate the checklist form
    $data = array(
      'identifier' => $db_reqn->identifier,
      'version' => $this->get_amendment_version(),
      'dateofapproval' => is_null( $date_of_approval ) ? 'None' : $date_of_approval->format( 'Y-m-d' ),
      'cost' => is_null( $cost )
        ? ( 'fr' == $db_language->code ? '(non calculé)' : '(not calculated)' )
        : sprintf( 'fr' == $db_language->code ? '%s $' : '$%s', $cost )
    );
    $data['applicant_name'] = sprintf( '%s %s', $db_user->first_name, $db_user->last_name );
    if( !is_null( $this->title ) ) $data['title'] = $this->title;

    $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Data Checklist' );
    $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
    $checklist_filename = sprintf( '%s/checklist_%s.pdf', TEMP_PATH, $this->id );

    if( $this->comprehensive ) $data['comprehensive'] = 'Yes';
    if( $this->tracking ) $data['tracking'] = 'Yes';
    if( $this->longitudinal ) $data['longitudinal'] = 'Yes';
    $data['last_identifier'] = !$this->longitudinal || is_null( $this->last_identifier )
                             ? ( 'fr' == $db_language->code ? 'S. o.' : 'N/A' )
                             : $this->last_identifier;
    if( $this->indigenous ) $data['indigenous_yes'] = 'Yes';
    else if( !$this->indigenous ) $data['indigenous_no'] = 'Yes';
    if( $this->indigenous_description ) $data['indigenous_description'] = $this->indigenous_description;

    $data_selection_sel = lib::create( 'database\select' );
    $data_selection_sel->add_table_column( 'data_category', 'rank', 'category_rank' );
    $data_selection_sel->add_table_column( 'data_option', 'rank', 'option_rank' );
    $data_selection_sel->add_table_column( 'study_phase', 'code' );
    $data_selection_mod = lib::create( 'database\modifier' );
    $data_selection_mod->join( 'data_option', 'data_selection.data_option_id', 'data_option.id' );
    $data_selection_mod->join( 'data_category', 'data_option.data_category_id', 'data_category.id' );
    $data_selection_mod->join( 'study_phase', 'data_selection.study_phase_id', 'study_phase.id' );
    foreach( $this->get_data_selection_list( $data_selection_sel, $data_selection_mod ) as $data_selection )
    {
      $data[ sprintf(
        'c%d_o%d_%s',
        $data_selection['category_rank'],
        $data_selection['option_rank'],
        $data_selection['code']
      ) ] = 'Yes';
    }

    $comment_sel = lib::create( 'database\select' );
    $comment_sel->add_table_column( 'data_category', 'rank' );
    $comment_sel->add_column( 'description' );
    $comment_mod = lib::create( 'database\modifier' );
    $comment_mod->join( 'data_category', 'reqn_version_comment.data_category_id', 'data_category.id' );
    $comment_mod->where( 'description', '!=', NULL );
    $comment_mod->order( 'data_category.rank' );

    foreach( $this->get_reqn_version_comment_list( $comment_sel, $comment_mod ) as $reqn_version_comment )
      $data[ sprintf( 'c%d_comment', $reqn_version_comment['rank'] ) ] = $reqn_version_comment['description'];

    $justification_sel = lib::create( 'database\select' );
    $justification_sel->add_table_column( 'data_category', 'rank', 'data_category_rank' );
    $justification_sel->add_table_column( 'data_option', 'rank', 'data_option_rank' );
    $justification_sel->add_column( 'description' );
    $justification_mod = lib::create( 'database\modifier' );
    $justification_mod->join( 'data_option', 'data_justification.data_option_id', 'data_option.id' );
    $justification_mod->join( 'data_category', 'data_option.data_category_id', 'data_category.id' );
    $justification_mod->where( 'description', '!=', NULL );
    $justification_mod->where( 'data_option.justification', '=', true );
    $justification_mod->order( 'data_category.rank' );
    $justification_mod->order( 'data_option.rank' );

    foreach( $this->get_data_justification_list( $justification_sel, $justification_mod ) as $data_justification )
    {
      $data[ sprintf(
        'c%d_o%d_justification',
        $data_justification['data_category_rank'],
        $data_justification['data_option_rank']
      ) ] = $data_justification['description'];
    }

    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF checklist form since there is no active PDF template.', __METHOD__ );

    $error = $db_pdf_form->fill_and_write_form( $data, $checklist_filename );
    if( $error )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $checklist_filename,
          $db_reqn->identifier,
          "\n".$error
        ),
        __METHOD__
      );
    }

    // now generate the combined PDF form containing both application and checklist
    $application_and_checklist_filename = sprintf( '%s/application_and_checklist_%s.pdf', TEMP_PATH, $this->id );
    $pdf_writer = lib::create( 'business\pdf_writer' );
    $pdf_writer->merge( array( $application_filename, $checklist_filename ) );
    if( !$pdf_writer->save( $application_and_checklist_filename ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $application_and_checklist_filename,
          $db_reqn->identifier,
          "\n".$pdf_writer->get_error()
        ),
        __METHOD__
      );
    }
  }

  /**
   * Generates a CSV file indicating all data options which have been selected
   */
  public function generate_data_option_list_csv()
  {
    $study_class_name = lib::get_class_name( 'database\study' );
    $data_category_class_name = lib::get_class_name( 'database\data_category' );

    $study_id = $study_class_name::get_unique_record( 'name', 'CLSA' )->id;
    $db_user = lib::create( 'business\session' )->get_user();
    $date_of_approval = $this->get_date_of_approval();
    $date_of_approval = is_null( $date_of_approval ) ? 'N/A' : $date_of_approval->format( 'Y-m-d' );

    $select = lib::create( 'database\select' );
    $select->from( 'reqn_version' );
    $select->add_table_column( 'reqn', 'identifier', 'Identifier' );
    $select->add_column(
      'CONCAT( IF( "." = reqn_version.amendment, "", reqn_version.amendment ), reqn_version.version )',
      'Version',
      false
    );
    $select->add_constant( $date_of_approval, 'Date of Approval', false );
    $select->add_column( 'CONCAT( user.first_name, " ", user.last_name )', 'Primary Applicant', false );
    $select->add_column( 'applicant_affiliation', 'Affiliation' );
    $select->add_column( 'title', 'Project Title' );
    $select->add_column( 'tracking', 'Tracking' );
    $select->add_column( 'comprehensive', 'Comprehensive' );
    $select->add_column( 'IFNULL( reqn_version.last_identifier, "N/A" )', 'Related Project', false );

    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'reqn', 'reqn_version.reqn_id', 'reqn.id' );
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->where( 'reqn_version.id', '=', $this->id );

    $output = util::get_data_as_csv(
      static::db()->get_all( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) ),
      $db_user,
      true
    );

    // get all selections to fill in below
    $selection_sel = lib::create( 'database\select' );
    $selection_sel->add_column( 'CONCAT( "c", data_category.id )', 'c', false );
    $selection_sel->add_column( 'CONCAT( "o", data_option.id )', 'o', false );
    $selection_sel->add_table_column( 'study_phase', 'id', 'study_phase_id' );

    $selection_mod = lib::create( 'database\modifier' );
    $selection_mod->join( 'study_phase', 'data_selection.study_phase_id', 'study_phase.id' );
    $selection_mod->join( 'data_option', 'data_selection.data_option_id', 'data_option.id' );
    $selection_mod->join( 'data_category', 'data_option.data_category_id', 'data_category.id' );
    $selection_mod->order( 'data_category.rank' );
    $selection_mod->order( 'data_option.rank' );
    $selection_mod->order( 'study_phase.rank' );
    $selection_list = array();
    foreach( $this->get_data_selection_list( $selection_sel, $selection_mod ) as $selection )
    {
      $c = $selection['c'];
      $o = $selection['o'];

      if( !array_key_exists( $c, $selection_list ) ) $selection_list[$c] = array();
      if( !array_key_exists( $o, $selection_list[$c] ) ) $selection_list[$o] = array();

      $selection_list[$c][$o][] = $selection['study_phase_id'];
    }

    // build each category's data options one table at a time
    $data_category_mod = lib::create( 'database\modifier' );
    $data_category_mod->order( 'rank' );
    foreach( $data_category_class_name::select_objects( $data_category_mod ) as $db_data_category )
    {
      // use this as an array key
      $c = sprintf( 'c%d', $db_data_category->id );

      // build this category's header
      $output .= sprintf( '%s"%s"%s"Data Option"', "\n", strtoupper( $db_data_category->name_en ), "\n" );

      $study_phase_sel = lib::create( 'database\select' );
      $study_phase_sel->add_column( 'id' );
      $study_phase_sel->add_table_column( 'study', 'name', 'study_name' );
      $study_phase_sel->add_column( 'name', 'study_phase_name' );

      $study_phase_mod = lib::create( 'database\modifier' );
      $study_phase_mod->join( 'study', 'study_phase.study_id', 'study.id' );
      $study_phase_mod->order( 'study.name' );
      $study_phase_mod->order( 'study_phase.rank' );
      $study_phase_list = $db_data_category->get_study_phase_list( $study_phase_sel, $study_phase_mod );
      foreach( $study_phase_list as $study_phase )
        $output .= sprintf( ',"%s - %s"', $study_phase['study_name'], $study_phase['study_phase_name'] );

      // now fill in all data options for this category, one option per row with one column for each study phase
      $data_option_mod = lib::create( 'database\modifier' );
      $data_option_mod->order( 'data_option.rank' );
      foreach( $db_data_category->get_data_option_object_list( $data_option_mod ) as $db_data_option )
      {
        // use this as an array key
        $o = sprintf( 'o%d', $db_data_option->id );

        $output .= sprintf( '%s"%s"', "\n", $db_data_option->name_en );
        foreach( $study_phase_list as $study_phase )
        {
          $output .= sprintf(
            ',"%s"',
            array_key_exists( $c, $selection_list ) &&
            array_key_exists( $o, $selection_list[$c] ) &&
            in_array( $study_phase['id'], $selection_list[$c][$o] ) ? 'yes' : 'no'
          );
        }
      }

      $output .= "\n";
    }

    $filename = sprintf( '%s/data_option_list_%s.csv', TEMP_PATH, $this->id );
    $result = file_put_contents( $filename, $output );
    if( false === $result )
    {
      throw lib::create( 'exception\runtime',
        sprintf( 'Failed to generate CSV file "%s"', $filename ),
        __METHOD__
      );
    }
  }
}
